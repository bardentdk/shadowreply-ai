import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'glass animate-fade-in flex flex-col items-center justify-center rounded-2xl p-12 text-center',
        className
      )}
    >
      {icon && (
        <div className="bg-accent-primary/10 border-accent-primary/20 mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border">
          {icon}
        </div>
      )}
      <h3 className="text-foreground mb-2 text-lg font-semibold">{title}</h3>
      {description && (
        <p className="text-foreground-muted mb-6 max-w-md text-sm leading-relaxed">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}