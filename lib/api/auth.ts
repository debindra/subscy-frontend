import { apiClient } from './client';

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface AccountContextInfo {
  context: 'personal' | 'business';
  label: string;
  isActive: boolean;
}

export interface AccountContextsResponse {
  availableContexts: AccountContextInfo[];
  currentContext: 'personal' | 'business';
}

export interface CreateAccountContextData {
  accountType: 'personal' | 'business';
  companyName?: string;
  companyAddress?: string;
  companyTaxId?: string;
  companyPhone?: string;
}

export interface SwitchAccountContextData {
  accountContext: 'personal' | 'business';
}

export const authApi = {
  changePassword: async (data: ChangePasswordData) => {
    const response = await apiClient.post<{ message: string }>('/auth/change-password', data);
    return response;
  },
  
  getAccountContexts: () =>
    apiClient.get<AccountContextsResponse>('/auth/account-contexts'),
  
  createAccountContext: (data: CreateAccountContextData) =>
    apiClient.post<{ message: string; accountType: string }>('/auth/create-account-context', data),
  
  switchAccountContext: (accountContext: 'personal' | 'business') =>
    apiClient.post<{ message: string; accountContext: string }>('/auth/switch-account-context', {
      accountContext,
    } as SwitchAccountContextData),
};

