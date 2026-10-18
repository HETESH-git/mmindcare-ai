import { useState, useCallback, useRef } from 'react';
import type { Emotion } from '@/types/chat';

interface UseEmotionDetectionReturn {
  detectEmotion: () => Promise<Emotion>;
  isDetecting: boolean;
  lastEmotion: Emotion | null;
  error: string | null;
}

// Text-based mood detection as fallback
function detectMoodFromText(text: string): Emotion {
  const lowerText = text.toLowerCase();
  
  const sadWords = ['sad', 'depressed', 'cry', 'unhappy', 'lonely', 'hurt', 'pain', 'tired', 'stress', 'anxious', 'worried', 'hopeless'];
  const happyWords = ['happy', 'joy', 'glad', 'excited', 'great', 'wonderful', 'amazing', 'good', 'fantastic', 'blessed'];
  const angryWords = ['angry', 'mad', 'furious', 'annoyed', 'frustrated', 'hate', 'irritated'];
  const fearWords = ['scared', 'afraid', 'terrified', 'nervous', 'anxious', 'panic'];
  
  if (sadWords.some(word => lowerText.includes(word))) return 'Sad';
  if (happyWords.some(word => lowerText.includes(word))) return 'Happy';
  if (angryWords.some(word => lowerText.includes(word))) return 'Angry';
  if (fearWords.some(word => lowerText.includes(word))) return 'Fear';
  
  return 'Neutral';
}

export function useEmotionDetection(): UseEmotionDetectionReturn {
  const [isDetecting, setIsDetecting] = useState(false);
  const [lastEmotion, setLastEmotion] = useState<Emotion | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const detectEmotion = useCallback(async (): Promise<Emotion> => {
    setIsDetecting(true);
    setError(null);

    try {
      // Try to access webcam
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: 640, height: 480 } 
      });
      streamRef.current = stream;

      // Create video element to capture frame
      const video = document.createElement('video');
      video.srcObject = stream;
      video.autoplay = true;
      videoRef.current = video;

      // Wait for video to be ready
      await new Promise<void>((resolve) => {
        video.onloadedmetadata = () => {
          video.play();
          resolve();
        };
      });

      // Give camera time to adjust
      await new Promise(resolve => setTimeout(resolve, 500));

      // Capture frame to canvas
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        
        // For now, we'll use a simplified emotion detection
        // In production, you'd send this to an API or use face-api.js
        // We'll randomly select an emotion for demo, weighted towards neutral
        const emotions: Emotion[] = ['Happy', 'Sad', 'Neutral', 'Neutral', 'Neutral', 'Surprised'];
        const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
        
        setLastEmotion(randomEmotion);
        
        // Clean up
        stream.getTracks().forEach(track => track.stop());
        
        setIsDetecting(false);
        return randomEmotion;
      }

      throw new Error('Could not get canvas context');
    } catch (err) {
      console.error('Emotion detection error:', err);
      
      // Fallback to neutral if camera unavailable
      const fallbackEmotion: Emotion = 'Neutral';
      setLastEmotion(fallbackEmotion);
      setError('Camera unavailable, using neutral emotion');
      setIsDetecting(false);
      return fallbackEmotion;
    } finally {
      // Cleanup
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  }, []);

  return {
    detectEmotion,
    isDetecting,
    lastEmotion,
    error,
  };
}

export { detectMoodFromText };
