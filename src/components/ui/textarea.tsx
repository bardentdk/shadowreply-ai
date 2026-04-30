'use client';

import {
  forwardRef,
  useId,
  type TextareaHTMLAttributes,
} from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  showCounter?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      showCounter,
      maxLength,
      value,
      id,
      ...props
    },
    ref
  ) => {
    const reactId = useId();
    const textareaId = id || `textarea-${reactId}`;
    const currentLength =
      typeof value === 'string' ? value.length : 0;

    return (
      <div className="w-full">
        {label && (
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor={textareaId}
              className="text-foreground-muted text-sm font-medium"
            >
              {label}
            </label>
            {showCounter && maxLength && (
              <span
                className={cn(
                  'text-xs tabular-nums',
                  currentLength > maxLength * 0.9
                    ? 'text-warning'
                    : 'text-foreground-subtle'
                )}
              >
                {currentLength}/{maxLength}
              </span>
            )}
          </div>
        )}

        <textarea
          id={textareaId}
          ref={ref}
          maxLength={maxLength}
          value={value}
          className={cn(
            'glass placeholder:text-foreground-subtle text-foreground min-h-[100px] w-full rounded-xl px-4 py-3 text-sm leading-relaxed transition-all',
            'focus:border-accent-primary/50 focus:outline-none focus:ring-2 focus:ring-accent-primary/30',
            'resize-none',
            error &&
              'border-danger/50 focus:border-danger focus:ring-danger/30',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${textareaId}-error` : undefined}
          {...props}
        />

        {error && (
          <p
            id={`${textareaId}-error`}
            className="text-danger mt-1.5 text-xs"
            role="alert"
          >
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

Textarea.displayName = 'Textarea';