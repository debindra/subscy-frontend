import { User } from '@supabase/supabase-js';

/**
 * Gets the user's avatar URL from various possible locations in user metadata.
 * Checks raw_user_meta_data and user_metadata for common avatar field names.
 * 
 * @param user - The Supabase user object
 * @returns The avatar URL string, or null if not found
 */
export function getUserAvatarUrl(user: User | null): string | null {
  if (!user) return null;

  // Check if user has raw_user_meta_data (OAuth providers store avatar here)
  const rawMetadata = (user as any).raw_user_meta_data;
  if (rawMetadata) {
    if (rawMetadata.avatar_url) return rawMetadata.avatar_url;
    if (rawMetadata.picture) return rawMetadata.picture;
    if (rawMetadata.avatar) return rawMetadata.avatar;
  }

  // Check user_metadata (custom metadata or merged OAuth data)
  const userMetadata = user.user_metadata;
  if (userMetadata) {
    if (userMetadata.avatar_url) return userMetadata.avatar_url;
    if (userMetadata.picture) return userMetadata.picture;
    if (userMetadata.avatar) return userMetadata.avatar;
  }

  return null;
}

/**
 * Gets user's display name from metadata, falling back to email username
 * 
 * @param user - The Supabase user object
 * @returns The display name string
 */
export function getUserDisplayName(user: User | null): string {
  if (!user) return 'Account';
  
  const metadata = user.user_metadata || {};
  return (
    (metadata.full_name as string | undefined) ||
    (metadata.name as string | undefined) ||
    (user.email ? user.email.split('@')[0] : 'Account')
  );
}

