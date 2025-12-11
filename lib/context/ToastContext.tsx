'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast, ToastType } from '@/components/ui/Toast';

interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).substring(7);
    // Safely convert message to string if it's accidentally an object
    const messageString = typeof message === 'string' 
      ? message 
      : typeof message === 'object' && message !== null
      ? (message as any).text || (message as any).message || 'Notification'
      : String(message);
    
    console.log('🔥 Toast triggered:', { id, message: messageString, type });
    
    setToasts((prev) => {
      const newToasts = [...prev, { id, message: messageString, type }];
      console.log('🔥 Current toasts state:', newToasts.length, 'toasts');
      return newToasts;
    });
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  console.log('🔥 ToastProvider render - toasts count:', toasts.length);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        className="fixed top-4 left-1/2 z-[9999] space-y-3 flex flex-col items-center pointer-events-none"
        style={{ 
          transform: 'translateX(-50%)',
        }}
        aria-live="polite"
        aria-atomic="true"
        role="status"
      >
        {toasts.length > 0 && (
          <>
            {console.log('🔥 Rendering', toasts.length, 'toasts')}
            {toasts.map((toast) => {
              console.log('🔥 Rendering toast:', toast.id, toast.message);
              return (
                <div 
                  key={toast.id} 
                  className="pointer-events-auto"
                  style={{ transform: 'translateX(-50%)' }}
                >
                  <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => {
                      console.log('🔥 Closing toast:', toast.id);
                      removeToast(toast.id);
                    }}
                  />
                </div>
              );
            })}
          </>
        )}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

