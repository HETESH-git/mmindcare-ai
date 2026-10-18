import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Send, BarChart3, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InputBarProps {
  onSend: (message: string) => void;
  onVoiceStart: () => void;
  onVoiceStop: () => void;
  onMoodClick: () => void;
  isListening: boolean;
  isLoading: boolean;
  disabled?: boolean;
}

export function InputBar({
  onSend,
  onVoiceStart,
  onVoiceStop,
  onMoodClick,
  isListening,
  isLoading,
  disabled,
}: InputBarProps) {
  const [input, setInput] = useState('');

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (input.trim() && !disabled && !isLoading) {
        onSend(input.trim());
        setInput('');
      }
    },
    [input, onSend, disabled, isLoading]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e as unknown as React.FormEvent);
      }
    },
    [handleSubmit]
  );

  return (
    <div className="glass-strong border-t border-border/50 px-4 py-4 md:px-6">
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-3 max-w-4xl mx-auto"
      >
        {/* 🎤 PRESS & HOLD VOICE BUTTON */}
        <Button
          type="button"
          variant={isListening ? 'destructive' : 'success'}
          size="icon"
          disabled={isLoading}
          aria-label="Hold to speak"
          className={cn(
            'flex-shrink-0',
            isListening && 'animate-recording'
          )}
          onMouseDown={onVoiceStart}
          onMouseUp={onVoiceStop}
          onMouseLeave={onVoiceStop}
          onTouchStart={onVoiceStart}
          onTouchEnd={onVoiceStop}
        >
          <Mic className="w-5 h-5" />
        </Button>

        {/* Text Input */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? 'Listening…' : 'Share your thoughts…'}
            disabled={disabled || isLoading || isListening}
            className={cn(
              'w-full h-12 px-5 rounded-xl bg-input border border-border/50',
              'text-foreground placeholder:text-muted-foreground',
              'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50',
              'transition-all duration-200',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              isListening && 'animate-pulse-soft'
            )}
          />

          {isListening && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="flex gap-1">
                <div className="w-1.5 h-4 bg-destructive rounded-full animate-typing-1" />
                <div className="w-1.5 h-5 bg-destructive rounded-full animate-typing-2" />
                <div className="w-1.5 h-3 bg-destructive rounded-full animate-typing-3" />
              </div>
            </div>
          )}
        </div>

        {/* Send Button */}
        <Button
          type="submit"
          variant="default"
          size="icon"
          disabled={!input.trim() || disabled || isLoading}
          aria-label="Send message"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </Button>

        {/* Mood Chart */}
        <Button
          type="button"
          variant="accent"
          size="icon"
          onClick={onMoodClick}
          aria-label="View mood chart"
        >
          <BarChart3 className="w-5 h-5" />
        </Button>
      </form>
    </div>
  );
}
