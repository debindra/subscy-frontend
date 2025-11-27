import { QueryClient } from '@tanstack/react-query';

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // Avoid refetching on every navigation; keep data warm for a bit
        staleTime: 1000 * 60 * 2, // 2 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        refetchOnMount: false,
        retry: 1,
      },
    },
  });


