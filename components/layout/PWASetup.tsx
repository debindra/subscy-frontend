'use client';

import { useEffect } from 'react';
import { registerServiceWorker } from '@/lib/utils/registerServiceWorker';

export const PWASetup: React.FC = () => {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return null;
};

