import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { KeyRound, ArrowRight, Sparkles } from 'lucide-react';

interface ApiKeyInputProps {
  onSubmit: (apiKey: string) => void;
}

export function ApiKeyInput({ onSubmit }: ApiKeyInputProps) {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      setError('Please enter your OpenRouter API key');
      return;
    }

    if (!apiKey.startsWith('sk-or-')) {
      setError('Please enter a valid OpenRouter API key (starts with sk-or-)');
      return;
    }

    setError('');
    onSubmit(apiKey.trim());
  }, [apiKey, onSubmit]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4 glow-primary">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-gradient mb-2">
            Wellness Companion
          </h1>
          <p className="text-muted-foreground">
            Your supportive mental wellness friend
          </p>
        </div>

        {/* API Key Form */}
        <form onSubmit={handleSubmit} className="glass-strong rounded-2xl p-6 border border-border/50">
          <div className="mb-6">
            <label htmlFor="apiKey" className="block text-sm font-medium text-foreground mb-2">
              OpenRouter API Key
            </label>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-or-v1-..."
                className="w-full h-12 pl-12 pr-4 rounded-xl bg-input border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200"
              />
            </div>
            {error && (
              <p className="mt-2 text-sm text-destructive">{error}</p>
            )}
          </div>

          <Button type="submit" className="w-full" size="lg">
            Start Chatting
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>

          <p className="mt-4 text-xs text-center text-muted-foreground">
            Get your API key from{' '}
            <a
              href="https://openrouter.ai/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              openrouter.ai
            </a>
          </p>
        </form>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="p-3">
            <div className="text-2xl mb-1">🎤</div>
            <p className="text-xs text-muted-foreground">Voice Input</p>
          </div>
          <div className="p-3">
            <div className="text-2xl mb-1">😊</div>
            <p className="text-xs text-muted-foreground">Emotion Detection</p>
          </div>
          <div className="p-3">
            <div className="text-2xl mb-1">📊</div>
            <p className="text-xs text-muted-foreground">Mood Tracking</p>
          </div>
        </div>
      </div>
    </div>
  );
}
