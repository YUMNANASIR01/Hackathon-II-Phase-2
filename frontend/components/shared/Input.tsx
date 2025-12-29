import React from 'react';
import { cn } from '@/lib/utils';
import type { InputProps } from '@/lib/types';

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helpText, icon, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium text-gray-200 mb-2"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            className={cn(
              'w-full px-4 py-2.5 rounded-lg border transition-all duration-200',
              'bg-gray-900 text-gray-100 placeholder-gray-500',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-gray-800',
              'disabled:bg-gray-800 disabled:cursor-not-allowed disabled:text-gray-500',
              error
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-700 focus:ring-primary-500',
              icon && 'pl-10',
              className
            )}
            {...props}
          />
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              {icon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-red-400">{error}</p>
        )}
        {helpText && !error && (
          <p className="mt-1.5 text-sm text-gray-400">{helpText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
