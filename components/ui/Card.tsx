import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  style?: React.CSSProperties;
  variant?: 'elevated' | 'glass' | 'flat';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  style,
  variant = 'elevated',
  ...rest
}) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };
  
  const base = `${paddingClasses[padding]} rounded-2xl transition-all duration-200 ${className}`;
  const variants: Record<string, string> = {
    elevated: 'bg-white/95 dark:bg-gray-800/95 border border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-xl',
    glass: 'bg-white/70 dark:bg-gray-800/60 backdrop-blur-md border border-white/40 dark:border-gray-700/40 shadow-lg hover:shadow-xl',
    flat: 'bg-white dark:bg-gray-800 border border-transparent',
  };

  return (
    <div
      {...rest}
      className={`${variants[variant]} ${base}`}
      style={style}
    >
      {children}
    </div>
  );
};

