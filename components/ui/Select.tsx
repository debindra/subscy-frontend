import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  hideLabel?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  className = '',
  id,
  hideLabel = false,
  ...props
}) => {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <div className="w-full relative">
      {label && !hideLabel && (
        <label
          htmlFor={selectId}
          className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          className={`w-full px-4 py-2.5 pr-10 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent transition-all duration-200 appearance-none ${
            props.disabled 
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed border-gray-300 dark:border-gray-600' 
              : 'hover:border-gray-400 dark:hover:border-gray-500'
          } ${
            error ? 'border-red-500 dark:border-red-400 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600'
          } ${className}`}
          style={{
            WebkitAppearance: 'none',
            MozAppearance: 'none',
            appearance: 'none',
            position: 'relative',
            zIndex: 1,
          }}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {/* Custom dropdown arrow */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none z-10">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
};

