import axios from 'axios';
import { supabase } from '../supabase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add auth token and account context to requests
apiClient.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  
  // Add account context header if available
  if (typeof window !== 'undefined') {
    const accountContext = localStorage.getItem('activeAccountContext');
    if (accountContext && (accountContext === 'personal' || accountContext === 'business')) {
      config.headers['X-Account-Context'] = accountContext;
    }
  }
  
  return config;
});

// Handle token refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const { data: { session }, error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshError || !session) {
        // Redirect to login
        window.location.href = '/auth/login';
        return Promise.reject(error);
      }
      
      // Retry the request with new token
      error.config.headers.Authorization = `Bearer ${session.access_token}`;
      return apiClient.request(error.config);
    }
    
    return Promise.reject(error);
  }
);

