'use client';

import { LayoutList, LayoutGrid } from 'lucide-react';
import { usePaperCardViewStore } from '@/stores/paper';

/**
 * ViewModeToggle 組件
 * 切換整頁模式（scroll）和卡片模式（card）
 * 在 A 模式顯示切換到 B 模式的按鈕
 */
export default function ViewModeToggle() {
  const viewMode = usePaperCardViewStore((state) => state.viewMode);
  const setViewMode = usePaperCardViewStore((state) => state.setViewMode);

  const toggleViewMode = () => {
    setViewMode(viewMode === 'scroll' ? 'card' : 'scroll');
  };

  return (
    <button
      onClick={toggleViewMode}
      className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
      aria-label={viewMode === 'scroll' ? '切換到卡片模式' : '切換到整頁模式'}
    >
      {viewMode === 'scroll' ? (
        <>
          <LayoutGrid className="h-4 w-4" />
          <span>卡片</span>
        </>
      ) : (
        <>
          <LayoutList className="h-4 w-4" />
          <span>整頁</span>
        </>
      )}
    </button>
  );
}
