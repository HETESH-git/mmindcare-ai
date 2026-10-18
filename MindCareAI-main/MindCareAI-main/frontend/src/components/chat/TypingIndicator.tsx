import { Sparkles } from 'lucide-react';

export function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-fade-in">
      {/* Avatar */}
      <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center bg-primary/20 text-primary shadow-sm">
        <Sparkles className="w-5 h-5" />
      </div>

      {/* Typing bubble */}
      <div className="bg-ai-bubble rounded-2xl rounded-tl-md px-5 py-4 shadow-sm">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-ai-foreground/60 animate-typing-1" />
          <div className="w-2.5 h-2.5 rounded-full bg-ai-foreground/60 animate-typing-2" />
          <div className="w-2.5 h-2.5 rounded-full bg-ai-foreground/60 animate-typing-3" />
        </div>
      </div>
    </div>
  );
}
