'use client';

import { useSidebar } from '@/contexts/SidebarContext';
import { Sidebar } from './Sidebar';

interface SidebarLayoutProps {
  children: React.ReactNode;
  lockScroll?: boolean;
}

export function SidebarLayout({ children, lockScroll = false }: SidebarLayoutProps) {
  const { mobileOpen, setMobileOpen } = useSidebar();

  if (lockScroll) {
    return (
      <div className="relative h-[100dvh] overflow-hidden">
        <Sidebar
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />
        <div className="h-full overflow-hidden">
          {children}
        </div>
      </div>
    );
  }

  return (
    <>
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="lg:ml-64 transition-all duration-300">
        {children}
      </div>
    </>
  );
}
