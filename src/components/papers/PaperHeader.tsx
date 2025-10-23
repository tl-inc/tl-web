/**
 * PaperHeader Component
 * 
 * 試卷頁面的 Header，包含標題、狀態、統計資訊
 */

import { Clock, Play, CheckCircle, XCircle } from 'lucide-react';
import ViewModeToggle from './CardView/ViewModeToggle';

interface PaperHeaderProps {
  paperId: number;
  totalItems: number;
  mode: 'pending' | 'in_progress' | 'completed' | 'abandoned';
  correctCount?: number;
  totalCount?: number;
}

export function PaperHeader({
  paperId,
  totalItems,
  mode,
  correctCount = 0,
  totalCount = 0,
}: PaperHeaderProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6 mb-3">
      {/* 第一列：標題 + ViewModeToggle */}
      <div className="mb-4 flex items-center justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          試卷 #{paperId}
        </h1>
        <ViewModeToggle />
      </div>

      {/* 第二列：狀態資訊 */}
      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>題數: {totalItems}</span>
        </div>

        {mode === 'completed' && (
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-green-600 dark:text-green-400 font-semibold">
              已完成
            </span>
          </div>
        )}

        {mode === 'abandoned' && (
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-500" />
            <span className="text-red-600 dark:text-red-400 font-semibold">
              已放棄
            </span>
          </div>
        )}

        {mode === 'in_progress' && (
          <div className="flex items-center gap-2">
            <Play className="w-4 h-4 text-blue-500" />
            <span className="text-blue-600 dark:text-blue-400 font-semibold">
              作答中 ({correctCount}/{totalCount})
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
