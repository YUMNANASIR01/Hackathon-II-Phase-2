import React from 'react';
import { cn } from '@/lib/utils';
import type { CardProps } from '@/lib/types';

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, as: Component = 'div', onClick, children }, ref) => {
    return (
      <Component
        ref={ref}
        onClick={onClick}
        className={cn(
          'rounded-lg border border-gray-800 bg-gray-900 shadow-lg',
          'transition-all duration-200',
          onClick && 'hover:shadow-xl hover:border-gray-700 cursor-pointer hover:bg-gray-850',
          className
        )}
      >
        {children}
      </Component>
    );
  }
);

Card.displayName = 'Card';
