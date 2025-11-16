import { apiClient } from './client';

export interface UserSettings {
  id: string;
  userId: string;
  monthlyBudget: number | null;
  budgetAlertsEnabled: boolean;
  budgetAlertThreshold: number;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateSettingsData {
  monthlyBudget?: number | null;
  budgetAlertsEnabled?: boolean;
  budgetAlertThreshold?: number;
}

export interface BudgetStatus {
  withinBudget: boolean;
  budgetAmount: number | null;
  spendingAmount: number;
  percentageUsed: number | null;
  alertTriggered: boolean;
}

export const settingsApi = {
  getSettings: () => apiClient.get<UserSettings>('/settings'),
  
  updateSettings: (data: UpdateSettingsData) =>
    apiClient.patch<UserSettings>('/settings', data),
  
  getBudgetStatus: (currentSpending: number) =>
    apiClient.get<BudgetStatus>('/settings/budget-status', {
      params: { currentSpending },
    }),
};

