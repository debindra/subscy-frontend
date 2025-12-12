import { apiClient } from './client';

// ============================================================================
// Types
// ============================================================================

export interface CheckoutSessionRequest {
  plan: 'pro' | 'ultimate';
  billing_cycle: 'monthly' | 'annual';
  success_url: string;
  cancel_url: string;
}

export interface CheckoutSessionResponse {
  checkout_url: string;
  session_id: string;
}

export interface PortalSessionRequest {
  return_url: string;
}

export interface PortalSessionResponse {
  portal_url: string;
}

export interface SubscriptionStatus {
  plan: string;
  display_name: string;
  status: string;
  billing_cycle: string | null;
  is_trial: boolean;
  trial_ends_at: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
}

export interface BillingConfig {
  publishable_key: string;
  enabled: boolean;
}

// ============================================================================
// API Client
// ============================================================================

export const billingApi = {
  /**
   * Get Stripe configuration (publishable key and enabled status)
   */
  getConfig: () =>
    apiClient.get<BillingConfig>('/billing/config'),

  /**
   * Create a Stripe Checkout session for purchasing a subscription
   * Returns a URL to redirect the user to Stripe's hosted checkout
   */
  createCheckoutSession: (data: CheckoutSessionRequest) =>
    apiClient.post<CheckoutSessionResponse>('/billing/checkout-session', data),

  /**
   * Create a Stripe Customer Portal session for managing subscription
   * Returns a URL to redirect the user to Stripe's customer portal
   */
  createPortalSession: (data: PortalSessionRequest) =>
    apiClient.post<PortalSessionResponse>('/billing/portal-session', data),

  /**
   * Get current subscription status for the authenticated user
   */
  getSubscription: () =>
    apiClient.get<SubscriptionStatus>('/billing/subscription'),
};
