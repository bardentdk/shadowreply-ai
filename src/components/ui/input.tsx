'use client';

import {
  forwardRef,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { className, label, error, helperText, icon, type, id, ...props },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;
    const inputId =
      id ||
      `input-${(label || '').toLowerCase().replace(/\s+/g, '-')}-${Math.random().toString(36).slice(2, 7)}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-foreground-muted mb-2 block text-sm font-medium"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="text-foreground-subtle pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
              {icon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            type={inputType}
            className={cn(
              'glass placeholder:text-foreground-subtle text-foreground h-11 w-full rounded-xl px-4 text-sm transition-all',
              'focus:border-accent-primary/50 focus:outline-none focus:ring-2 focus:ring-accent-primary/30',
              icon && 'pl-10',
              isPassword && 'pr-10',
              error && 'border-danger/50 focus:border-danger focus:ring-danger/30',
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="text-foreground-subtle hover:text-foreground absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
              tabIndex={-1}
              aria-label={
                showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'
              }
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          )}
        </div>

        {error && (
          <p
            id={`${inputId}-error`}
            className="text-danger mt-1.5 text-xs"
            role="alert"
          >
            {error}
          </p>
        )}

        {!error && helperText && (
          <p className="text-foreground-subtle mt-1.5 text-xs">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';