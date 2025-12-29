import React from 'react';
import { cn } from '@/lib/utils';
import type { TextareaProps } from '@/lib/types';

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helpText, className, ...props }, ref) => {
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
        <textarea
          ref={ref}
          className={cn(
            'w-full px-4 py-2.5 rounded-lg border transition-all duration-200',
            'bg-gray-900 text-gray-100 placeholder-gray-500',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-gray-800',
            'disabled:bg-gray-800 disabled:cursor-not-allowed disabled:text-gray-500',
            'resize-vertical min-h-[120px]',
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-700 focus:ring-primary-500',
            className
          )}
          {...props}
        />
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

Textarea.displayName = 'Textarea';
