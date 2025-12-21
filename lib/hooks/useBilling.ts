'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  billingApi,
  CheckoutSessionRequest,
  PortalSessionRequest,
  SubscriptionStatus,
  BillingConfig,
} from '../api/billing';
import { useAuth } from './useAuth';

// Query keys
const BILLING_CONFIG_KEY = ['billing', 'config'];
const SUBSCRIPTION_KEY = ['billing', 'subscription'];

/**
 * Hook to get Stripe configuration (publishable key and enabled status)
 */
export function useBillingConfig() {
  return useQuery<BillingConfig>({
    queryKey: BILLING_CONFIG_KEY,
    queryFn: async () => {
      const response = await billingApi.getConfig();
      return response.data;
    },
    staleTime: 1000 * 60 * 60, // 1 hour - config rarely changes
  });
}

/**
 * Hook to get current subscription status
 * Only fetches when user is authenticated
 */
export function useSubscription() {
  const { user } = useAuth();
  
  return useQuery<SubscriptionStatus>({
    queryKey: SUBSCRIPTION_KEY,
    queryFn: async () => {
      const response = await billingApi.getSubscription();
      return response.data;
    },
    enabled: !!user, // Only fetch when user is authenticated
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to create a Stripe Checkout session
 */
export function useCreateCheckoutSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CheckoutSessionRequest) => {
      const response = await billingApi.createCheckoutSession(data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate subscription query after checkout
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_KEY });
    },
  });
}

/**
 * Hook to create a Stripe Customer Portal session
 */
export function useCreatePortalSession() {
  return useMutation({
    mutationFn: async (data: PortalSessionRequest) => {
      const response = await billingApi.createPortalSession(data);
      return response.data;
    },
  });
}

/**
 * Combined hook for initiating checkout flow
 * Handles redirecting to Stripe Checkout
 */
export function useCheckout() {
  const createCheckoutSession = useCreateCheckoutSession();

  const initiateCheckout = async (
    plan: 'pro' | 'ultimate',
    billingCycle: 'monthly' | 'annual'
  ) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

    const result = await createCheckoutSession.mutateAsync({
      plan,
      billing_cycle: billingCycle,
      success_url: `${baseUrl}/checkout/success`,
      cancel_url: `${baseUrl}/checkout/cancel`,
    });

    // Redirect to Stripe Checkout
    if (result.checkout_url) {
      window.location.href = result.checkout_url;
    }

    return result;
  };

  return {
    initiateCheckout,
    isLoading: createCheckoutSession.isPending,
    error: createCheckoutSession.error,
  };
}

/**
 * Combined hook for opening customer portal
 * Handles redirecting to Stripe Customer Portal
 */
export function useCustomerPortal() {
  const createPortalSession = useCreatePortalSession();

  const openPortal = async (returnUrl?: string) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const url = returnUrl || `${baseUrl}/dashboard/billing`;

    const result = await createPortalSession.mutateAsync({
      return_url: url,
    });

    // Redirect to Stripe Customer Portal
    if (result.portal_url) {
      window.location.href = result.portal_url;
    }

    return result;
  };

  return {
    openPortal,
    isLoading: createPortalSession.isPending,
    error: createPortalSession.error,
  };
}

/**
 * Helper to check if user is on a paid plan
 */
export function isPaidPlan(subscription: SubscriptionStatus | null | undefined): boolean {
  if (!subscription) return false;
  return subscription.plan === 'pro' || subscription.plan === 'ultimate';
}

/**
 * Helper to check if subscription is active (not canceled or past due)
 */
export function isActiveSubscription(subscription: SubscriptionStatus | null | undefined): boolean {
  if (!subscription) return false;
  return subscription.status === 'active' || subscription.status === 'trialing';
}
