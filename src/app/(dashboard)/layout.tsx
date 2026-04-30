'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Topbar } from '@/components/dashboard/topbar';
import { useUser } from '@/hooks/use-user';
import { useUsage } from '@/hooks/use-usage';
import { UsageContext } from '@/hooks/use-usage-context';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { profile } = useUser();
  const usageState = useUsage();

  return (
    <UsageContext.Provider value={usageState}>
      <div className="bg-background flex min-h-screen">
        <Sidebar
          usage={usageState.usage}
          usageLoading={usageState.loading}
          mobileOpen={mobileMenuOpen}
          onMobileClose={() => setMobileMenuOpen(false)}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar
            profile={profile}
            onMenuToggle={() => setMobileMenuOpen(true)}
          />

          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="mx-auto w-full max-w-5xl">{children}</div>
          </main>
        </div>
      </div>
    </UsageContext.Provider>
  );
}