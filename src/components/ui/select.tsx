'use client';

import { forwardRef, useId, type SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, children, id, ...props }, ref) => {
    const reactId = useId();
    const selectId = id || `select-${reactId}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="text-foreground-muted mb-2 block text-sm font-medium"
          >
            {label}
          </label>
        )}

        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              'glass text-foreground h-11 w-full appearance-none rounded-xl px-4 pr-10 text-sm transition-all',
              'focus:border-accent-primary/50 focus:outline-none focus:ring-2 focus:ring-accent-primary/30',
              error &&
                'border-danger/50 focus:border-danger focus:ring-danger/30',
              className
            )}
            {...props}
          >
            {children}
          </select>
          <ChevronDown
            className="text-foreground-subtle pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2"
            aria-hidden
          />
        </div>

        {error && (
          <p className="text-danger mt-1.5 text-xs" role="alert">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p className="text-foreground-subtle mt-1.5 text-xs">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';