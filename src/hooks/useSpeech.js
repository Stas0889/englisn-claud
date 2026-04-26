import { useCallback } from 'react';

export function useSpeech(accent = 'en-US') {
  const speak = useCallback(
    (text) => {
      if (!text) return;
      if (typeof window === 'undefined' || !window.speechSynthesis) {
        console.warn('SpeechSynthesis is not available in this browser');
        return;
      }
      try {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = accent;
        utter.rate = 0.95;
        utter.pitch = 1;
        window.speechSynthesis.speak(utter);
      } catch (e) {
        console.warn('Speech failed:', e);
      }
    },
    [accent],
  );

  return { speak };
}
