import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SettingsSectionProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function SettingsSection({
  title,
  description,
  icon,
  children,
  className,
}: SettingsSectionProps) {
  return (
    <section
      className={cn(
        'glass-elevated animate-fade-in rounded-2xl p-6 md:p-8',
        className
      )}
    >
      <header className="mb-6 flex items-start gap-3">
        {icon && (
          <div className="bg-accent-primary/10 border-accent-primary/20 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border">
            {icon}
          </div>
        )}
        <div>
          <h2 className="text-foreground text-base font-semibold md:text-lg">
            {title}
          </h2>
          {description && (
            <p className="text-foreground-muted mt-0.5 text-sm">
              {description}
            </p>
          )}
        </div>
      </header>

      <div className="space-y-5">{children}</div>
    </section>
  );
}