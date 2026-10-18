import { cn } from '@/lib/utils';

interface StatusIndicatorProps {
  status: 'ready' | 'listening' | 'thinking' | 'speaking';
}

const STATUS_CONFIG = {
  ready: {
    text: 'Ready to chat',
    color: 'bg-success',
    textColor: 'text-success',
  },
  listening: {
    text: 'Listening...',
    color: 'bg-destructive',
    textColor: 'text-destructive',
  },
  thinking: {
    text: 'Thinking...',
    color: 'bg-primary',
    textColor: 'text-primary',
  },
  speaking: {
    text: 'Speaking...',
    color: 'bg-secondary',
    textColor: 'text-secondary',
  },
};

export function StatusIndicator({ status }: StatusIndicatorProps) {
  const config = STATUS_CONFIG[status];

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          'w-2 h-2 rounded-full',
          config.color,
          status !== 'ready' && 'animate-pulse'
        )}
      />
      <span className={cn('text-xs font-medium', config.textColor)}>
        {config.text}
      </span>
    </div>
  );
}
