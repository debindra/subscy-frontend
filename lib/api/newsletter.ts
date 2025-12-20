import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface NewsletterSubscribeResponse {
  success: boolean;
  message: string;
}

export async function subscribeToNewsletter(
  email: string
): Promise<NewsletterSubscribeResponse> {
  try {
    const response = await axios.post<NewsletterSubscribeResponse>(
      `${API_URL}/newsletter/subscribe`,
      { email },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        'Failed to subscribe to newsletter';
      throw new Error(message);
    }
    throw error;
  }
}

