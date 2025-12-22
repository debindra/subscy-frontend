export const PASSWORD_REQUIREMENTS = [
  'At least 8 characters long',
  'One uppercase letter (A-Z)',
  'One lowercase letter (a-z)',
  'One number (0-9)',
  'One special character (!@#$%^&*)',
];

export const PASSWORD_ERROR_MESSAGE =
  'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export const isPasswordStrong = (value: string) => PASSWORD_REGEX.test(value);

export type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong';

export const calculatePasswordStrength = (password: string): PasswordStrength => {
  if (!password) return 'weak';
  
  let score = 0;
  
  // Length checks
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  
  // Character variety checks
  if (/[a-z]/.test(password)) score += 1; // lowercase
  if (/[A-Z]/.test(password)) score += 1; // uppercase
  if (/\d/.test(password)) score += 1; // number
  if (/[^A-Za-z0-9]/.test(password)) score += 1; // special character
  
  // Determine strength based on score
  if (score <= 2) return 'weak';
  if (score <= 4) return 'fair';
  if (score <= 6) return 'good';
  return 'strong';
};

export const getPasswordStrengthColor = (strength: PasswordStrength): string => {
  switch (strength) {
    case 'weak':
      return 'bg-red-500';
    case 'fair':
      return 'bg-orange-500';
    case 'good':
      return 'bg-yellow-500';
    case 'strong':
      return 'bg-green-500';
    default:
      return 'bg-gray-300';
  }
};

export const getPasswordStrengthLabel = (strength: PasswordStrength): string => {
  switch (strength) {
    case 'weak':
      return 'Weak';
    case 'fair':
      return 'Fair';
    case 'good':
      return 'Good';
    case 'strong':
      return 'Strong';
    default:
      return '';
  }
};

export const getPasswordStrengthWidth = (strength: PasswordStrength): string => {
  switch (strength) {
    case 'weak':
      return 'w-1/4';
    case 'fair':
      return 'w-2/4';
    case 'good':
      return 'w-3/4';
    case 'strong':
      return 'w-full';
    default:
      return 'w-0';
  }
};

