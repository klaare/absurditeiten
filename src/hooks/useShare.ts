import { useCallback } from 'react';
import type { Tongbreker } from '../types';

export const useShare = () => {
  const isSupported = 'share' in navigator;

  const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }

      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();

      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);

      return successful;
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      return false;
    }
  };

  const share = useCallback(
    async (tongbreker: Tongbreker): Promise<{ success: boolean; method: 'share' | 'copy' }> => {
      if (isSupported) {
        try {
          await navigator.share({
            title: '🔥 Tering Tongbreker',
            text: tongbreker.text,
            url: window.location.href,
          });
          return { success: true, method: 'share' };
        } catch (error: any) {
          if (error.name === 'AbortError') {
            return { success: false, method: 'share' };
          }
          console.error('Error sharing:', error);
        }
      }

      // Fallback to clipboard
      const success = await copyToClipboard(tongbreker.text);
      return { success, method: 'copy' };
    },
    [isSupported]
  );

  return {
    share,
    isSupported,
  };
};
