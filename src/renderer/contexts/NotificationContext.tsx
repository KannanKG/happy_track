import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AppError } from '../../utils/errorHandler';

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  showError: (error: AppError) => void;
  showSuccess: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  timestamp: Date;
  duration?: number; // Auto-dismiss after this many ms
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto-dismiss after duration
    if (notification.duration) {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, notification.duration);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const showError = (error: AppError) => {
    addNotification({
      type: 'error',
      title: 'Error',
      message: error.message,
      duration: 10000, // Keep errors longer
    });
  };

  const showSuccess = (message: string) => {
    addNotification({
      type: 'success',
      title: 'Success',
      message,
      duration: 5000,
    });
  };

  const showWarning = (message: string) => {
    addNotification({
      type: 'warning',
      title: 'Warning',
      message,
      duration: 7000,
    });
  };

  const showInfo = (message: string) => {
    addNotification({
      type: 'info',
      title: 'Info',
      message,
      duration: 5000,
    });
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        clearNotifications,
        showError,
        showSuccess,
        showWarning,
        showInfo,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};