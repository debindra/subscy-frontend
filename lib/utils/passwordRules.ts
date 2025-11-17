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

