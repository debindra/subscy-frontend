'use client';

import React from 'react';
import {
  calculatePasswordStrength,
  getPasswordStrengthColor,
  getPasswordStrengthLabel,
  getPasswordStrengthWidth,
  type PasswordStrength,
} from '@/lib/utils/passwordRules';

type PasswordStrengthProps = {
  password: string;
  className?: string;
};

export function PasswordStrength({ password, className = '' }: PasswordStrengthProps) {
  if (!password) return null;

  const strength: PasswordStrength = calculatePasswordStrength(password);
  const color = getPasswordStrengthColor(strength);
  const label = getPasswordStrengthLabel(strength);
  const width = getPasswordStrengthWidth(strength);

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-600 dark:text-gray-400 font-medium">Password strength:</span>
        <span
          className={`font-semibold ${
            strength === 'weak'
              ? 'text-red-600 dark:text-red-400'
              : strength === 'fair'
              ? 'text-orange-600 dark:text-orange-400'
              : strength === 'good'
              ? 'text-yellow-600 dark:text-yellow-400'
              : 'text-green-600 dark:text-green-400'
          }`}
        >
          {label}
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
        <div
          className={`${width} ${color} h-full transition-all duration-300 ease-out rounded-full`}
        />
      </div>
    </div>
  );
}

