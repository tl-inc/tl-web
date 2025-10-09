'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, History, BarChart3, TrendingUp, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const sidebarItems = [
  {
    title: '開始練習',
    icon: BookOpen,
    href: '/paper-configuration',
  },
  {
    title: '考卷回顧',
    icon: History,
    href: '/paper-history',
  },
  {
    title: '程度分析',
    icon: BarChart3,
    href: '/analytics',
  },
  {
    title: '成長曲線',
    icon: TrendingUp,
    href: '/chart',
  }
];

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const pathname = usePathname();

  const handleToggle = () => {
    setIsTransitioning(true);
    setCollapsed(!collapsed);
    // Match transition duration (300ms)
    setTimeout(() => setIsTransitioning(false), 300);
  };

  // Close mobile menu when route changes (only when pathname changes)
  useEffect(() => {
    if (mobileOpen) {
      onMobileClose();
    }
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-40 w-64",
          // Desktop behavior: always visible, collapsible, smooth transition
          "lg:block lg:transition-all lg:duration-300",
          collapsed ? "lg:w-16" : "lg:w-64",
          "lg:translate-x-0",
          // Mobile behavior: slide in/out with transform
          "transition-transform duration-300 ease-in-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Desktop Toggle Button */}
        <button
          onClick={handleToggle}
          className="hidden lg:block absolute -right-3 top-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>

        {/* Mobile Close Button */}
        <button
          onClick={onMobileClose}
          className="lg:hidden absolute right-4 top-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Navigation Items */}
        <nav className="p-4 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                  isActive
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
                  collapsed && "lg:justify-center"
                )}
                title={collapsed ? item.title : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {/* Desktop: hide text when collapsed OR transitioning */}
                {/* Mobile: always show text */}
                <span className={cn(
                  "font-medium whitespace-nowrap",
                  "lg:inline",
                  (collapsed || isTransitioning) && "lg:hidden"
                )}>
                  {item.title}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
