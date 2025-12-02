import { apiClient } from './client';

export interface UserSettings {
  id: string;
  userId: string;
  monthlyBudget: number | null;
  budgetAlertsEnabled: boolean;
  budgetAlertThreshold: number;
  timezone: string | null;
  /**
   * Daily notification time in HH:MM (24h) format, interpreted in user's timezone
   */
  notificationTime: string | null;
  /**
   * Preferred default currency code for dashboard summaries, e.g. 'USD'
   */
  defaultCurrency?: string | null;
  /**
   * Whether email alerts are enabled for subscription reminders
   */
  emailAlertEnabled?: boolean;
  /**
   * Whether push notifications are enabled for subscription reminders
   */
  pushNotificationEnabled?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateSettingsData {
  monthlyBudget?: number | null;
  budgetAlertsEnabled?: boolean;
  budgetAlertThreshold?: number;
  timezone?: string | null;
  notificationTime?: string | null;
  defaultCurrency?: string | null;
  emailAlertEnabled?: boolean;
  pushNotificationEnabled?: boolean;
}

export interface BudgetStatus {
  withinBudget: boolean;
  budgetAmount: number | null;
  spendingAmount: number;
  percentageUsed: number | null;
  alertTriggered: boolean;
}

export const settingsApi = {
  getSettings: () => apiClient.get<UserSettings>('/settings/'),
  
  updateSettings: (data: UpdateSettingsData) =>
    apiClient.patch<UserSettings>('/settings/', data),
  
  getBudgetStatus: (currentSpending: number) =>
    apiClient.get<BudgetStatus>('/settings/budget-status', {
      params: { currentSpending },
    }),
};

