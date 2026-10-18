import { cn } from '@/lib/utils';
import type { Message } from '@/types/chat';
import { User, Sparkles, Info } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  return (
    <div
      className={cn(
        'flex gap-3 animate-slide-up',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center shadow-sm',
          isUser && 'bg-success/20 text-success',
          message.role === 'assistant' && 'bg-primary/20 text-primary',
          isSystem && 'bg-muted text-muted-foreground'
        )}
      >
        {isUser && <User className="w-5 h-5" />}
        {message.role === 'assistant' && <Sparkles className="w-5 h-5" />}
        {isSystem && <Info className="w-5 h-5" />}
      </div>

      {/* Message Content */}
      <div
        className={cn(
          'max-w-[75%] rounded-2xl px-4 py-3 shadow-sm',
          isUser && 'bg-user-bubble text-user-foreground rounded-tr-md',
          message.role === 'assistant' && 'bg-ai-bubble text-ai-foreground rounded-tl-md',
          isSystem && 'bg-system-bubble text-system-foreground rounded-tl-md'
        )}
      >
        {/* Sender label */}
        <div
          className={cn(
            'text-xs font-semibold mb-1 opacity-70',
            isUser && 'text-right'
          )}
        >
          {isUser ? 'You' : message.role === 'assistant' ? 'Wellness Friend' : 'System'}
          {message.emotion && (
            <span className="ml-2 opacity-60">• {message.emotion}</span>
          )}
        </div>

        {/* Message text */}
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>

        {/* Timestamp */}
        <div
          className={cn(
            'text-[10px] mt-2 opacity-50',
            isUser && 'text-right'
          )}
        >
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
    </div>
  );
}
