'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Suspense, lazy, useRef, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { usePaperDataStore, usePaperCardViewStore } from '@/stores/paper';
import ExerciseCard from './ExerciseCard';
import NavigationControls from './NavigationControls';
import ProgressBar from './ProgressBar';
import { useKeyboardNavigation } from './hooks/useKeyboardNavigation';
import { EmptyState } from '@/components/common/EmptyState';

// 懶加載 NavigationPanel
const NavigationPanel = lazy(() => import('./NavigationPanel'));

/**
 * CardViewContainer 組件
 * 卡片式檢閱模式的主容器
 */
export default function CardViewContainer() {
  const paper = usePaperDataStore((state) => state.paper);
  const currentExerciseIndex = usePaperCardViewStore((state) => state.currentExerciseIndex);
  const isNavigationPanelOpen = usePaperCardViewStore((state) => state.isNavigationPanelOpen);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 啟用鍵盤快捷鍵
  useKeyboardNavigation();

  // 切換題目時，自動捲動到頂部
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentExerciseIndex]);

  if (!paper || paper.exercises.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center">
        <EmptyState message="無題目可顯示" spacing="compact" />
      </div>
    );
  }

  const currentExercise = paper.exercises[currentExerciseIndex];

  return (
    <div className="relative flex h-full w-full bg-gray-50 dark:bg-gray-900">
      {/* 左側：卡片區域 */}
      <div className="flex flex-1 flex-col bg-gray-50 dark:bg-gray-900">
        {/* 進度條 */}
        <ProgressBar />

        {/* 題目卡片 - 統一捲動區域 */}
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
          <ExerciseCard exercise={currentExercise} index={currentExerciseIndex} />
        </div>

        {/* 導航控制 */}
        <NavigationControls />

        {/* 快捷鍵提示 - 桌面版 */}
        <div className="hidden border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-2 text-center text-xs text-gray-500 dark:text-gray-400 md:block">
          <span>快捷鍵: </span>
          <kbd className="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-1.5 py-0.5">←</kbd>
          <span> / </span>
          <kbd className="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-1.5 py-0.5">→</kbd>
          <span> 切換題目</span>
          <span className="mx-2">|</span>
          <kbd className="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-1.5 py-0.5">M</kbd>
          <span> 標記</span>
          <span className="mx-2">|</span>
          <kbd className="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-1.5 py-0.5">N</kbd>
          <span> 目錄</span>
        </div>
      </div>

      {/* 右側：導航面板 - 覆蓋在題卡上 */}
      <AnimatePresence>
        {isNavigationPanelOpen && (
          <>
            {/* 遮罩 - 限制在容器內 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 z-40 bg-black/20"
              onClick={() => usePaperStore.getState().toggleNavigationPanel()}
            />

            {/* 導航面板 */}
            <motion.div
              initial={{ x: 320 }}
              animate={{ x: 0 }}
              exit={{ x: 320 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute right-0 top-0 z-50 h-full w-80 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl"
            >
              <Suspense
                fallback={
                  <div className="flex h-full items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500 dark:text-blue-400" />
                  </div>
                }
              >
                <NavigationPanel />
              </Suspense>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
