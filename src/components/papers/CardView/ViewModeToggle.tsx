'use client';

import { LayoutList, LayoutGrid } from 'lucide-react';
import { usePaperStore } from '@/stores/usePaperStore';

/**
 * ViewModeToggle 組件
 * 切換整頁模式（scroll）和卡片模式（card）
 */
export default function ViewModeToggle() {
  const viewMode = usePaperStore((state) => state.viewMode);
  const setViewMode = usePaperStore((state) => state.setViewMode);

  return (
    <div className="flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-1">
      <button
        onClick={() => setViewMode('scroll')}
        className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
          viewMode === 'scroll'
            ? 'bg-blue-500 dark:bg-blue-600 text-white shadow-sm'
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
        aria-label="整頁模式"
      >
        <LayoutList className="h-4 w-4" />
        <span>整頁</span>
      </button>
      <button
        onClick={() => setViewMode('card')}
        className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
          viewMode === 'card'
            ? 'bg-blue-500 dark:bg-blue-600 text-white shadow-sm'
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
        aria-label="卡片模式"
      >
        <LayoutGrid className="h-4 w-4" />
        <span>卡片</span>
      </button>
    </div>
  );
}
