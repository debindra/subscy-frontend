import React from 'react';

export const getCategoryIcon = (category: string): React.ReactNode => {
  const iconClass = "w-6 h-6";
  
  switch (category.toLowerCase()) {
    case 'entertainment':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'development':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      );
    case 'productivity':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      );
    case 'cloud services':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      );
    case 'design':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      );
    case 'marketing':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      );
    case 'communication':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      );
    case 'security':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      );
    case 'finance':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'education':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      );
    default:
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      );
  }
};

export const getCategoryColor = (category: string): string => {
  switch (category.toLowerCase()) {
    case 'entertainment':
      return 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400';
    case 'development':
      return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400';
    case 'productivity':
      return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400';
    case 'cloud services':
      return 'bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400';
    case 'design':
      return 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400';
    case 'marketing':
      return 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400';
    case 'communication':
      return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400';
    case 'security':
      return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400';
    case 'finance':
      return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400';
    case 'education':
      return 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400';
    default:
      return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400';
  }
};

export const getCardBrandIcon = (brand: string): React.ReactNode => {
  const iconClass = "w-8 h-5";
  
  switch (brand.toLowerCase()) {
    case 'visa':
      return (
        <svg className={iconClass} viewBox="0 0 60 37" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="60" height="37" rx="4" fill="#1A1F71"/>
          <path d="M26.5 12.5L21 24.5H18.2L23.7 12.5H26.5ZM38.5 12.5L33.5 22.5L32 19.5C31.2 17.5 30.5 15.5 29.5 13.5H35L38.5 12.5ZM13.5 12.5H7.5C6.8 12.5 6.2 12.8 5.8 13.3L2.5 24.5H4.5L5.5 21H10L10.8 19H8L8.8 17.5H12L13.5 12.5ZM53 19.5L54 13.5H49C48.3 13.5 47.7 13.8 47.3 14.3L42 24.5H44L44.5 22L47.5 22L53 19.5Z" fill="white"/>
          <path d="M19.5 12.5H15.5L12.5 20.5L11.5 15.5C11.2 14.5 10.8 13.8 10.3 13.5H4L3.8 14.2C4.5 14.5 5.2 15.2 5.5 16L9.5 24.5H13L18.5 12.5H19.5Z" fill="white" opacity="0.9"/>
        </svg>
      );
    case 'mastercard':
      return (
        <svg className={iconClass} viewBox="0 0 60 37" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="60" height="37" rx="4" fill="#000"/>
          <circle cx="23" cy="18.5" r="11" fill="#EB001B"/>
          <circle cx="37" cy="18.5" r="11" fill="#F79E1B"/>
          <path d="M30 12C32 14 33 16 33 18.5C33 21 32 23 30 25C28 23 27 21 27 18.5C27 16 28 14 30 12Z" fill="#FF5F00"/>
        </svg>
      );
    case 'amex':
      return (
        <svg className={iconClass} viewBox="0 0 60 37" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="60" height="37" rx="4" fill="#006FCF"/>
          <path d="M12 8H8L6 12L4 8H1V28H2V14L4 18H4.5L6.5 14V28H7.5V18L9.5 22H10L12 18V28H13V8H12ZM18.5 8H15.5V28H18.5V8ZM30.5 8H25.5L25 9H25.5C26 8.5 26.5 8 27 8C27.5 8 28 8 28.5 8.5V9.5C28 9.5 27.5 9.5 27 9.5C26 9.5 25.5 10 25 11V28H26.5V19L28.5 28H30L32 19V28H33.5V11C33.5 10.5 33.5 10 33.5 9.5V9C33 9 32.5 9 32 9C31 9 30 9.5 29 10.5H28.5L28 8H30.5ZM28.5 18.5L30 12.5H29L27.5 18.5H28.5ZM43 8H45L46 12L47 8H49V28H48V14L47 18H46.5L45.5 14V28H44.5V18L43.5 22H43L42 18V28H41V8H43Z" fill="white"/>
        </svg>
      );
    case 'discover':
      return (
        <svg className={iconClass} viewBox="0 0 60 37" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="60" height="37" rx="4" fill="#FF6000"/>
          <rect x="10" y="14" width="40" height="7" rx="1" fill="white"/>
          <circle cx="19" cy="17.5" r="2" fill="#FF6000"/>
          <circle cx="41" cy="17.5" r="2" fill="#FF6000"/>
          <path d="M30 10L34 17.5L30 25L26 17.5L30 10Z" fill="white"/>
        </svg>
      );
    case 'other':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      );
    default:
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      );
  }
};

