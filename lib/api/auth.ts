import { apiClient } from './client';

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export const authApi = {
  changePassword: async (data: ChangePasswordData) => {
    const response = await apiClient.post<{ message: string }>('/auth/change-password', data);
    return response;
  },
  sendWelcomeEmail: async () => {
    const response = await apiClient.post<{ message: string }>('/auth/send-welcome-email');
    return response;
  },
};

