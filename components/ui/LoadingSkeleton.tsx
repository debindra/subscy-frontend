import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string;
  height?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  width = '100%',
  height = '20px',
}) => {
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  return (
    <div
      className={`animate-shimmer ${variantClasses[variant]} ${className}`}
      style={{ width, height }}
    />
  );
};

export const SubscriptionCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start">
        <div className="flex-1 space-y-3">
          <Skeleton height="24px" width="60%" />
          <Skeleton height="16px" width="40%" />
          <Skeleton height="32px" width="50%" />
          <Skeleton height="16px" width="70%" />
        </div>
        <div className="flex flex-col space-y-2">
          <Skeleton variant="circular" width="40px" height="40px" />
          <Skeleton variant="circular" width="40px" height="40px" />
        </div>
      </div>
    </div>
  );
};

export const StatCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-3 flex-1">
          <Skeleton height="16px" width="50%" />
          <Skeleton height="36px" width="70%" />
        </div>
        <Skeleton variant="circular" width="56px" height="56px" />
      </div>
    </div>
  );
};

