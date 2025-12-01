'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ViewMode = 'compact' | 'detailed';

interface ViewModeContextType {
  viewMode: ViewMode;
  toggleViewMode: () => void;
  setViewMode: (mode: ViewMode) => void;
}

const ViewModeContext = createContext<ViewModeContextType | undefined>(undefined);

interface ViewModeProviderProps {
  children: ReactNode;
}

export const ViewModeProvider: React.FC<ViewModeProviderProps> = ({ children }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('detailed');

  // Load view mode from localStorage on mount
  useEffect(() => {
    const savedViewMode = localStorage.getItem('subsy-view-mode') as ViewMode;
    if (savedViewMode && (savedViewMode === 'compact' || savedViewMode === 'detailed')) {
      setViewMode(savedViewMode);
    }
  }, []);

  // Save view mode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('subsy-view-mode', viewMode);
  }, [viewMode]);

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'compact' ? 'detailed' : 'compact');
  };

  return (
    <ViewModeContext.Provider value={{ viewMode, toggleViewMode, setViewMode }}>
      {children}
    </ViewModeContext.Provider>
  );
};

export const useViewMode = (): ViewModeContextType => {
  const context = useContext(ViewModeContext);
  if (context === undefined) {
    throw new Error('useViewMode must be used within a ViewModeProvider');
  }
  return context;
};