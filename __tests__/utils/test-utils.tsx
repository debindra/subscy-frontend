import React, { PropsWithChildren } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from '@/lib/context/ThemeContext';
import { ToastProvider } from '@/lib/context/ToastContext';

const AllProviders: React.FC<PropsWithChildren> = ({ children }) => (
  <ThemeProvider>
    <ToastProvider>{children}</ToastProvider>
  </ThemeProvider>
);

const customRender = (ui: React.ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: AllProviders, ...options });

export * from '@testing-library/react';
export { customRender as renderWithProviders };

