'use client';

import { useSidebar } from '@/contexts/SidebarContext';
import { Sidebar } from './Sidebar';

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  const { mobileOpen, setMobileOpen } = useSidebar();

  return (
    <div className="relative">
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      {children}
    </div>
  );
}
