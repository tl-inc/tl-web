'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, Target, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';

interface ScoreCardProps {
  score: number; // 0-100
  correctCount: number;
  totalCount: number;
}

export function ScoreCard({ score, correctCount, totalCount }: ScoreCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  // 計算答錯數
  const incorrectCount = totalCount - correctCount;

  // 根據分數決定顏色主題
  const getScoreTheme = (score: number) => {
    if (score >= 90) {
      return {
        bg: 'from-green-50/80 to-emerald-50/80 dark:from-green-950/30 dark:to-emerald-950/30',
        border: 'border-green-200/50 dark:border-green-700/50',
        text: 'text-green-700 dark:text-green-300',
        iconBg: 'bg-green-100 dark:bg-green-900/50',
        icon: 'text-green-600 dark:text-green-400',
      };
    } else if (score >= 70) {
      return {
        bg: 'from-blue-50/80 to-cyan-50/80 dark:from-blue-950/30 dark:to-cyan-950/30',
        border: 'border-blue-200/50 dark:border-blue-700/50',
        text: 'text-blue-700 dark:text-blue-300',
        iconBg: 'bg-blue-100 dark:bg-blue-900/50',
        icon: 'text-blue-600 dark:text-blue-400',
      };
    } else if (score >= 60) {
      return {
        bg: 'from-yellow-50/80 to-amber-50/80 dark:from-yellow-950/30 dark:to-amber-950/30',
        border: 'border-yellow-200/50 dark:border-yellow-700/50',
        text: 'text-yellow-700 dark:text-yellow-300',
        iconBg: 'bg-yellow-100 dark:bg-yellow-900/50',
        icon: 'text-yellow-600 dark:text-yellow-400',
      };
    } else {
      return {
        bg: 'from-red-50/80 to-pink-50/80 dark:from-red-950/30 dark:to-pink-950/30',
        border: 'border-red-200/50 dark:border-red-700/50',
        text: 'text-red-700 dark:text-red-300',
        iconBg: 'bg-red-100 dark:bg-red-900/50',
        icon: 'text-red-600 dark:text-red-400',
      };
    }
  };

  const theme = getScoreTheme(score);

  // 等級文字
  const getScoreLabel = (score: number) => {
    if (score >= 90) return '優異';
    if (score >= 70) return '良好';
    if (score >= 60) return '及格';
    return '待加強';
  };

  return (
    <div className={`rounded-xl border shadow-md bg-gradient-to-br ${theme.bg} ${theme.border}`}>
      {/* Header - 可點擊收合 */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors rounded-t-xl"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${theme.iconBg}`}>
            <Target className={`w-8 h-8 ${theme.icon}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">總分</p>
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-bold ${theme.text}`}>{score}</span>
              <span className="text-lg font-semibold text-gray-500 dark:text-gray-400">分</span>
              <span className={`text-sm font-semibold ml-2 ${theme.text}`}>{getScoreLabel(score)}</span>
            </div>
          </div>
        </div>
        <button className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg transition-colors">
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          )}
        </button>
      </div>

      {/* Expandable content */}
      {isExpanded && (
        <div className="px-8 pb-8 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
          <div className="flex gap-8 justify-center">
            {/* 答對數 */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/50">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{correctCount}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">答對</p>
            </div>

            {/* 答錯數 */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/50">
                  <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">{incorrectCount}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">答錯</p>
            </div>

            {/* 總題數 */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                  <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{totalCount}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">總題數</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
