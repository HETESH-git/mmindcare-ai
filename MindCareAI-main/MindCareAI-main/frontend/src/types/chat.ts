export type MessageRole = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  emotion?: string;
  timestamp: Date;
}

export interface ConversationMemory {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export type Emotion = 
  | 'Happy'
  | 'Sad'
  | 'Angry'
  | 'Surprised'
  | 'Fear'
  | 'Disgust'
  | 'Neutral';

export interface MoodEntry {
  emotion: Emotion;
  timestamp: Date;
}
