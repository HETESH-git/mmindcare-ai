import { useRef, useEffect, useState, useCallback } from 'react';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { InputBar } from './InputBar';
import { MoodChart } from './MoodChart';
import { StatusIndicator } from './StatusIndicator';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { Sparkles } from 'lucide-react';
import type { Message } from '@/types/chat';

export function ChatInterface() {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showMoodChart, setShowMoodChart] = useState(false);
  const [moodHistory, setMoodHistory] = useState<
    { emotion: string; timestamp: Date }[]
  >([]);

  const { isListening, transcript, startListening, stopListening, isSupported } =
    useSpeechRecognition();

  const { speak, isSpeaking } = useTextToSpeech();

  /* ---------------- Auto scroll ---------------- */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  /* ---------------- Voice transcript ---------------- */
  useEffect(() => {
    if (transcript && !isListening) {
      handleSendMessage(transcript);
    }
  }, [transcript, isListening]);

  /* ---------------- Welcome message (ONLY ONCE) ---------------- */
  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content:
          "Hello. I’m here with you. You don’t have to go through things alone. How are you feeling right now?",
        timestamp: new Date(),
      },
    ]);
  }, []);

  /* ---------------- MAIN SEND FUNCTION ---------------- */
  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content: content.trim(),
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, userMessage]);
      setIsLoading(true);

      try {
        const response = await fetch('http://127.0.0.1:8000/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: content.trim() }),
        });

        if (!response.ok) {
          throw new Error(`Backend error ${response.status}`);
        }

        const data = await response.json();

        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: data.reply,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, assistantMessage]);
        setMoodHistory(prev => [
          ...prev,
          { emotion: data.emotion, timestamp: new Date() },
        ]);

        speak(data.reply);
      } catch (err) {
        console.error(err);

        setMessages(prev => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            content:
              "I'm here with you, but I’m having a small technical issue right now. Let’s try again in a moment.",
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [speak]
  );

  /* ---------------- Status ---------------- */
  const getStatus = () => {
    if (isListening) return 'listening';
    if (isLoading) return 'thinking';
    if (isSpeaking) return 'speaking';
    return 'ready';
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="glass-strong border-b border-border/50 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">Wellness Companion</h1>
              <p className="text-xs text-muted-foreground">
                A calm, supportive space to talk
              </p>
            </div>
          </div>
          <StatusIndicator status={getStatus()} />
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map(msg => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input */}
      <InputBar
        onSend={handleSendMessage}
        onVoiceStart={() => isSupported && startListening()}
        onVoiceStop={stopListening}
        onMoodClick={() => setShowMoodChart(true)}
        isListening={isListening}
        isLoading={isLoading}
        disabled={false}
      />

      {/* Mood Chart */}
      <MoodChart
        isOpen={showMoodChart}
        onClose={() => setShowMoodChart(false)}
        moodHistory={moodHistory}
      />
    </div>
  );
}
