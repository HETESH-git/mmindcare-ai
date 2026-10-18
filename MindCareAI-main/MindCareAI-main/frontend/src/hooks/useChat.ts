import { useState, useCallback } from 'react';
import type { Message, Emotion, MoodEntry } from '@/types/chat';

interface UseChatReturn {
  messages: Message[];
  moodHistory: MoodEntry[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string, emotion?: Emotion) => Promise<string>;
  clearHistory: () => void;
}

// Backend API (FastAPI)
const BACKEND_URL = 'http://127.0.0.1:8000/chat';

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateId = () => Math.random().toString(36).substring(2, 15);

  const sendMessage = useCallback(async (content: string, emotion?: Emotion): Promise<string> => {
    setIsLoading(true);
    setError(null);

    // Add user message to UI
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content,
      emotion,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    // Track mood
    if (emotion) {
      setMoodHistory(prev => [...prev, { emotion, timestamp: new Date() }]);
    }

    try {
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: content }),
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      const data = await response.json();

      const aiReply = data.reply || "I'm here with you. Tell me more.";

      const aiMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: aiReply,
        emotion: data.emotion,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);

      return aiReply;
    } catch (err) {
      console.error('Chat error:', err);

      const errorMsg =
        "I'm having a little trouble responding right now. Please take a breath and try again in a moment.";

      const errorMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: errorMsg,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
      setError(errorMsg);
      setIsLoading(false);

      return errorMsg;
    }
  }, []);

  const clearHistory = useCallback(() => {
    setMessages([]);
    setMoodHistory([]);
  }, []);

  return {
    messages,
    moodHistory,
    isLoading,
    error,
    sendMessage,
    clearHistory,
  };
}
