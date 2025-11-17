'use client';

import React from 'react';
import { PASSWORD_REQUIREMENTS } from '@/lib/utils/passwordRules';

type PasswordRequirementsProps = {
  className?: string;
};

export function PasswordRequirements({ className = '' }: PasswordRequirementsProps) {
  return (
    <div
      className={`rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm text-gray-600 dark:text-gray-300 ${className}`}
    >
      <p className="font-semibold text-gray-800 dark:text-gray-100 mb-2 text-xs uppercase tracking-wide">
        Password requirements
      </p>
      <ul className="space-y-1 text-sm">
        {PASSWORD_REQUIREMENTS.map((rule) => (
          <li key={rule} className="flex items-center space-x-2">
            <span className="text-primary-500 dark:text-primary-300">•</span>
            <span>{rule}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

