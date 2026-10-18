import { useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { MoodEntry, Emotion } from '@/types/chat';

interface MoodChartProps {
  isOpen: boolean;
  onClose: () => void;
  moodHistory: MoodEntry[];
}

const EMOTION_COLORS: Record<Emotion, string> = {
  Happy: '#22c55e',
  Sad: '#3b82f6',
  Angry: '#ef4444',
  Surprised: '#f59e0b',
  Fear: '#8b5cf6',
  Disgust: '#6b7280',
  Neutral: '#94a3b8',
};

const EMOTION_EMOJIS: Record<Emotion, string> = {
  Happy: '😊',
  Sad: '😢',
  Angry: '😠',
  Surprised: '😮',
  Fear: '😨',
  Disgust: '🤢',
  Neutral: '😐',
};

export function MoodChart({ isOpen, onClose, moodHistory }: MoodChartProps) {
  const chartData = useMemo(() => {
    const counts: Record<string, number> = {};
    moodHistory.forEach(({ emotion }) => {
      counts[emotion] = (counts[emotion] || 0) + 1;
    });

    return Object.entries(counts).map(([emotion, count]) => ({
      emotion,
      count,
      emoji: EMOTION_EMOJIS[emotion as Emotion],
      color: EMOTION_COLORS[emotion as Emotion],
    }));
  }, [moodHistory]);

  const hasData = moodHistory.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg glass-strong border-border/50">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gradient">
            🌈 Your Emotional Journey
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {hasData ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <XAxis 
                    dataKey="emotion" 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    tickLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <YAxis 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    tickLine={{ stroke: 'hsl(var(--border))' }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.75rem',
                      boxShadow: 'var(--shadow-md)',
                    }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                    formatter={(value, name, props) => [
                      `${value} ${value === 1 ? 'time' : 'times'}`,
                      `${props.payload.emoji} ${props.payload.emotion}`
                    ]}
                    labelFormatter={() => ''}
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <div className="text-4xl mb-3">📊</div>
              <p className="text-muted-foreground">
                No mood data yet!
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Start chatting to see your emotional journey
              </p>
            </div>
          )}

          {hasData && (
            <div className="mt-4 pt-4 border-t border-border/50">
              <p className="text-sm text-muted-foreground text-center">
                Based on {moodHistory.length} {moodHistory.length === 1 ? 'interaction' : 'interactions'}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
