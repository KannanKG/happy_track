import React from 'react';
import { useNotifications, Notification } from '../contexts/NotificationContext';

const NotificationToast: React.FC<{ notification: Notification }> = ({ notification }) => {
  const { removeNotification } = useNotifications();

  const getIconAndColors = () => {
    switch (notification.type) {
      case 'success':
        return {
          icon: '✓',
          bgColor: 'bg-green-500',
          textColor: 'text-white',
        };
      case 'error':
        return {
          icon: '✕',
          bgColor: 'bg-red-500',
          textColor: 'text-white',
        };
      case 'warning':
        return {
          icon: '⚠',
          bgColor: 'bg-yellow-500',
          textColor: 'text-white',
        };
      case 'info':
        return {
          icon: 'ℹ',
          bgColor: 'bg-blue-500',
          textColor: 'text-white',
        };
      default:
        return {
          icon: 'ℹ',
          bgColor: 'bg-gray-500',
          textColor: 'text-white',
        };
    }
  };

  const { icon, bgColor, textColor } = getIconAndColors();

  return (
    <div className={`${bgColor} ${textColor} p-4 rounded-lg shadow-lg mb-2 max-w-sm`}>
      <div className="flex justify-between items-start">
        <div className="flex items-start">
          <span className="mr-2 text-lg">{icon}</span>
          <div>
            <h4 className="font-semibold">{notification.title}</h4>
            {notification.message && (
              <p className="text-sm mt-1 opacity-90">{notification.message}</p>
            )}
          </div>
        </div>
        <button
          onClick={() => removeNotification(notification.id)}
          className="ml-4 text-lg hover:opacity-70"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export const NotificationContainer: React.FC = () => {
  const { notifications } = useNotifications();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <NotificationToast key={notification.id} notification={notification} />
      ))}
    </div>
  );
};

export default NotificationToast;