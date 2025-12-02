import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string;
  height?: string;
  responsive?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  width = '100%',
  height = '20px',
  responsive = false,
}) => {
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  // Responsive width classes for mobile
  const responsiveWidthClass = responsive && width !== '100%' 
    ? 'w-full sm:w-auto' 
    : '';

  return (
    <div
      className={`animate-shimmer bg-gray-200 dark:bg-gray-700 ${variantClasses[variant]} ${responsiveWidthClass} ${className}`}
      style={responsive && width !== '100%' ? { height } : { width, height }}
    />
  );
};

export const SubscriptionCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
      <div className="flex justify-between items-start">
        <div className="flex-1 space-y-2 sm:space-y-3 min-w-0">
          <Skeleton width="60%" className="h-5 sm:h-6" />
          <Skeleton width="40%" className="h-4" />
          <Skeleton width="50%" className="h-8" />
          <Skeleton width="70%" className="h-4" />
        </div>
        <div className="flex flex-col space-y-2 ml-2 sm:ml-4">
          <Skeleton variant="circular" className="w-8 h-8 sm:w-10 sm:h-10" />
          <Skeleton variant="circular" className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>
      </div>
    </div>
  );
};

export const StatCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2 sm:space-y-3 flex-1 min-w-0">
          <Skeleton width="50%" className="h-3.5 sm:h-4" />
          <Skeleton width="70%" className="h-7 sm:h-9" />
        </div>
        <Skeleton variant="circular" className="w-12 h-12 sm:w-14 sm:h-14 ml-2 sm:ml-4 flex-shrink-0" />
      </div>
    </div>
  );
};

