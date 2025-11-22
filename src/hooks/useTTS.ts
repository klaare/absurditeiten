import { useState, useCallback } from 'react';
import type { TTSOptions } from '../types';

export const useTTS = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  const isSupported = 'speechSynthesis' in window;

  const speak = useCallback(
    async (text: string, id: string, options: TTSOptions = {}) => {
      if (!isSupported) {
        throw new Error('Text-to-Speech wordt niet ondersteund in deze browser');
      }

      const synth = window.speechSynthesis;

      // Stop if already speaking this one
      if (currentId === id && synth.speaking) {
        synth.cancel();
        setIsSpeaking(false);
        setCurrentId(null);
        return;
      }

      // Stop any current speech
      synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      // Get Dutch voices
      const voices = synth.getVoices();
      const dutchVoice = voices.find((v) => v.lang === 'nl-NL') || voices.find((v) => v.lang.startsWith('nl'));
      if (dutchVoice) {
        utterance.voice = dutchVoice;
      }

      utterance.lang = options.lang || 'nl-NL';
      utterance.rate = options.rate || 0.85;
      utterance.pitch = options.pitch || 1.0;
      utterance.volume = options.volume || 1.0;

      return new Promise<void>((resolve, reject) => {
        utterance.onstart = () => {
          setIsSpeaking(true);
          setCurrentId(id);
        };

        utterance.onend = () => {
          setIsSpeaking(false);
          setCurrentId(null);
          resolve();
        };

        utterance.onerror = (event) => {
          setIsSpeaking(false);
          setCurrentId(null);
          console.error('TTS error:', event);
          reject(new Error('Fout bij afspelen van audio'));
        };

        synth.speak(utterance);
      });
    },
    [currentId, isSupported]
  );

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentId(null);
    }
  }, [isSupported]);

  return {
    speak,
    stop,
    isSpeaking,
    currentId,
    isSupported,
  };
};
