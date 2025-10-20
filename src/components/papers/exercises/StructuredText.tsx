'use client';

import { memo, useState, useEffect, useRef } from 'react';
import type { StructuredBreakdownUnit } from '@/types/paper';

interface StructuredTextProps {
  /**
   * 結構化拆解單位 (完整句子,沒有 blank)
   */
  breakdown: StructuredBreakdownUnit[];
}

/**
 * StructuredText - 顯示結構化文本，支援點擊查看詳細資訊
 *
 * 用途:
 * - 公布答案時顯示完整句子
 * - 每個單字/片語可點擊查看翻譯、詞性和解釋
 * - 同時只會顯示一個字卡
 * - 點擊外部區域可關閉字卡
 */
export const StructuredText = memo(function StructuredText({
  breakdown,
}: StructuredTextProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLSpanElement>(null);

  // 點擊外部關閉字卡
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        if (activeIndex !== null) {
          e.stopPropagation();
          e.preventDefault();
          setActiveIndex(null);
        }
      }
    };

    if (activeIndex !== null) {
      document.addEventListener('mousedown', handleClickOutside, true);
      document.addEventListener('touchstart', handleClickOutside, true);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
      document.removeEventListener('touchstart', handleClickOutside, true);
    };
  }, [activeIndex]);

  return (
    <span ref={containerRef} className="inline leading-relaxed">
      {breakdown.map((unit, idx) => (
        <UnitSpan
          key={idx}
          unit={unit}
          isActive={activeIndex === idx}
          onToggle={() => setActiveIndex(activeIndex === idx ? null : idx)}
        />
      ))}
    </span>
  );
});

/**
 * 渲染單個 unit - 支援點擊顯示詳細資訊
 */
const UnitSpan = memo(function UnitSpan({
  unit,
  isActive,
  onToggle,
}: {
  unit: StructuredBreakdownUnit;
  isActive: boolean;
  onToggle: () => void;
}) {
  const isPunctuation = unit.pos === '標點符號';

  if (isPunctuation) {
    return <>{unit.content}{' '}</>;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onToggle();
  };
  return (
    <>
      <span
        className="relative inline-block cursor-pointer"
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        tabIndex={0}
      >
        <span className={`
          rounded transition-all duration-200
          ${isActive ? 'bg-blue-200 dark:bg-blue-800/50 px-1 py-0.5 scale-105' : ''}
        `}>
          {unit.content}
        </span>

        <span className={`
          absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-3
          px-4 py-3 bg-gray-900 dark:bg-gray-100
          text-white dark:text-gray-900 rounded-lg shadow-2xl
          whitespace-nowrap min-w-[120px]
          ${isActive ? 'visible opacity-100' : 'invisible opacity-0'}
          transition-opacity duration-200
        `}>
          <div className="font-bold text-base mb-2 text-center">{unit.translation}</div>
          <div className="text-gray-300 dark:text-gray-600 text-xs text-center mb-1">{unit.pos}</div>
          {unit.explanation && (
            <div className="text-gray-400 dark:text-gray-500 text-xs max-w-[250px] whitespace-normal text-center border-t border-gray-700 dark:border-gray-300 pt-2 mt-1">
              {unit.explanation}
            </div>
          )}
          <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1.5 border-[6px] border-transparent border-t-gray-900 dark:border-t-gray-100" />
        </span>
      </span>
      {/* 真實空格 */}
      {' '}
    </>
  );
});
