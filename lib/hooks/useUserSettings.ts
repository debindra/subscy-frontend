'use client';

import { useQuery } from '@tanstack/react-query';
import { settingsApi, UserSettings } from '../api/settings';

const USER_SETTINGS_KEY = ['user-settings'] as const;

export const useUserSettings = () => {
  return useQuery<UserSettings>({
    queryKey: USER_SETTINGS_KEY,
    queryFn: async (): Promise<UserSettings> => {
      const response = await settingsApi.getSettings();
      return response.data;
    },
    // Treat settings as relatively stable user preferences
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (renamed from cacheTime in v5)
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    placeholderData: (previousData) => previousData, // Use placeholderData instead of keepPreviousData in v5
  });
};


