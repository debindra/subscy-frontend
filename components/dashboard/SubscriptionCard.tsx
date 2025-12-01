'use client';

import React from 'react';
import { Subscription } from '@/lib/api/subscriptions';
import { useViewMode } from '@/lib/context/ViewModeContext';
import { useIsMobile } from '@/lib/hooks/useMediaQuery';
import { MobileSubscriptionCard } from './MobileSubscriptionCard';
import { DesktopSubscriptionCard } from './DesktopSubscriptionCard';
import { CompactSubscriptionCard } from './CompactSubscriptionCard';

interface SubscriptionCardProps {
  subscription: Subscription;
  onEdit: (subscription: Subscription) => void;
  onDelete: (id: string) => void;
  preferredCurrency?: string;
}

/**
 * Main SubscriptionCard component that routes to the appropriate card variant
 * based on view mode and screen size.
 */
export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  subscription,
  onEdit,
  onDelete,
  preferredCurrency = 'USD',
}) => {
  const { viewMode } = useViewMode();
  const isMobile = useIsMobile();

  // Render compact view (works on both mobile and desktop)
  if (viewMode === 'compact') {
    return (
      <CompactSubscriptionCard
        subscription={subscription}
        onEdit={onEdit}
        onDelete={onDelete}
        preferredCurrency={preferredCurrency}
      />
    );
  }

  // Render mobile or desktop view based on screen size
  if (isMobile) {
    return (
      <MobileSubscriptionCard
        subscription={subscription}
        onEdit={onEdit}
        onDelete={onDelete}
        preferredCurrency={preferredCurrency}
      />
    );
  }

  return (
    <DesktopSubscriptionCard
      subscription={subscription}
      onEdit={onEdit}
      onDelete={onDelete}
      preferredCurrency={preferredCurrency}
    />
  );
};
