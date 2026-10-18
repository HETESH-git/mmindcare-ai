import { useEffect, useRef, useState, useCallback } from 'react';

export function useSpeechRecognition() {
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();

    // 🔑 CRITICAL SETTINGS
    recognition.continuous = true;        // keeps listening
    recognition.interimResults = true;     // don't auto-stop
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      console.log('🎙 Speech result event:', event);

      let text = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          text += result[0].transcript;
        }
      }

      if (text.trim()) {
        console.log('✅ FINAL TRANSCRIPT:', text);
        setTranscript(text.trim());
      }
    };


    recognition.onerror = (e) => {
      console.error('Speech recognition error:', e);
      setIsListening(false);
    };

    recognition.onend = () => {
      // DO NOT auto-restart
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, []);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListening) return;

    setTranscript('');
    setIsListening(true);

    try {
      recognitionRef.current.start();
    } catch (e) {
      console.warn('Speech already started');
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;

    recognitionRef.current.stop();
    setIsListening(false);
  }, []);

  return {
    transcript,
    isListening,
    startListening,
    stopListening,
    isSupported,
  };
}
