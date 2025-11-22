import { useEffect } from 'react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

export const Notification = ({ message, type, onClose, duration = 3000 }: NotificationProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

  return (
    <div
      className={`fixed top-6 left-1/2 transform -translate-x-1/2 ${bgColor} text-white px-6 py-3 rounded-lg font-semibold shadow-2xl z-50 animate-slide-in`}
    >
      {message}
    </div>
  );
};
