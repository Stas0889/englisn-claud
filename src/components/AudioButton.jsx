import { useSpeech } from '../hooks/useSpeech.js';

export default function AudioButton({ text, accent = 'en-US', label = '🔊', size = 'md' }) {
  const { speak } = useSpeech(accent);

  const handleClick = (e) => {
    e.stopPropagation();
    speak(text);
  };

  if (typeof window !== 'undefined' && !window.speechSynthesis) {
    return null;
  }

  return (
    <button
      type="button"
      className={`audio-btn audio-btn--${size}`}
      onClick={handleClick}
      aria-label="Озвучить"
      title="Озвучить"
    >
      {label}
    </button>
  );
}
