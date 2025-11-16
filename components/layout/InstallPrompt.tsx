'use client';

import React, { useState } from 'react';
import { usePWA } from '@/lib/hooks/usePWA';
import { Button } from '../ui/Button';

export const InstallPrompt: React.FC = () => {
  const { installPrompt, isInstalled, promptInstall } = usePWA();
  const [isDismissed, setIsDismissed] = useState(false);

  if (isInstalled || !installPrompt || isDismissed) {
    return null;
  }

  const handleInstall = async () => {
    const installed = await promptInstall();
    if (!installed) {
      setIsDismissed(true);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 p-4 z-50 animate-slide-up">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 text-3xl">📱</div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            Install SubTracker
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Install our app for quick access and offline support
          </p>
          <div className="flex space-x-2">
            <Button onClick={handleInstall} size="sm">
              Install
            </Button>
            <Button onClick={handleDismiss} variant="outline" size="sm">
              Not now
            </Button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

