'use client';

import { memo, useState, useEffect, useRef } from 'react';
import type { StructuredBreakdownUnit } from '@/types/paper';

/**
 * 在結構化文本中尋找連續匹配的 units，用於 highlight 正確答案
 *
 * @param breakdown - 結構化拆解單位陣列
 * @param correctAnswers - 正確答案陣列（可能包含多個單字的字串，如 "is eating"）
 * @returns 需要 highlight 的 unit 索引集合
 */
export function findHighlightedIndices(
  breakdown: StructuredBreakdownUnit[],
  correctAnswers: string[]
): Set<number> {
  const highlighted = new Set<number>();

  correctAnswers.forEach(answer => {
    // Tokenize 答案（用空格分割，並過濾空字串）
    const tokens = answer.toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return;

    // 遍歷 breakdown，尋找連續匹配
    for (let i = 0; i <= breakdown.length - tokens.length; i++) {
      let matchCount = 0;
      let currentIndex = i;

      // 嘗試匹配所有 tokens
      for (let j = 0; j < tokens.length; j++) {
        // 跳過標點符號
        while (currentIndex < breakdown.length && breakdown[currentIndex].pos === '標點符號') {
          currentIndex++;
        }

        if (currentIndex >= breakdown.length) break;

        const unit = breakdown[currentIndex];
        if (unit.content.toLowerCase() === tokens[j]) {
          matchCount++;
          currentIndex++;
        } else {
          break;
        }
      }

      // 如果所有 tokens 都匹配成功
      if (matchCount === tokens.length) {
        // 標記這些匹配的 units（不包括標點符號）
        let tokenIndex = 0;
        for (let k = i; k < breakdown.length && tokenIndex < tokens.length; k++) {
          if (breakdown[k].pos === '標點符號') continue;
          if (breakdown[k].content.toLowerCase() === tokens[tokenIndex]) {
            highlighted.add(k);
            tokenIndex++;
          }
        }
        break; // 找到一個匹配就停止（避免重複標記）
      }
    }
  });

  return highlighted;
}

interface StructuredTextProps {
  /**
   * 結構化拆解單位 (完整句子,沒有 blank)
   */
  breakdown: StructuredBreakdownUnit[];
  /**
   * 需要 highlight 的 unit 索引集合 (用於標記正確答案)
   */
  highlightedIndices?: Set<number>;
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
  highlightedIndices,
}: StructuredTextProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLSpanElement>(null);

  // 點擊外部關閉字卡
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        if (activeIndex !== null) {
          e.stopPropagation();
          setActiveIndex(null);
        }
      }
    };

    if (activeIndex !== null) {
      document.addEventListener('mousedown', handleClickOutside, true);
      document.addEventListener('touchstart', handleClickOutside, { capture: true, passive: false });
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
          isHighlighted={highlightedIndices?.has(idx) ?? false}
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
  isHighlighted,
  onToggle,
}: {
  unit: StructuredBreakdownUnit;
  isActive: boolean;
  isHighlighted: boolean;
  onToggle: () => void;
}) {
  const isPunctuation = unit.pos === '標點符號';
  const lastTouchTime = useRef(0);
  const touchStartPos = useRef({ x: 0, y: 0 });

  if (isPunctuation) {
    return <>{unit.content}{' '}</>;
  }

  const handleClick = (e: React.MouseEvent) => {
    // 如果最近 500ms 內有觸摸事件，忽略點擊（避免重複觸發）
    if (Date.now() - lastTouchTime.current < 500) {
      e.preventDefault();
      return;
    }
    e.stopPropagation();
    onToggle();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    // 記錄觸摸開始位置，用於判斷是否為滾動
    const touch = e.touches[0];
    touchStartPos.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    // 計算觸摸移動距離
    const touch = e.changedTouches[0];
    const deltaX = Math.abs(touch.clientX - touchStartPos.current.x);
    const deltaY = Math.abs(touch.clientY - touchStartPos.current.y);

    // 如果移動距離小於 10px，視為點擊而非滾動
    if (deltaX < 10 && deltaY < 10) {
      e.preventDefault(); // 只在確定是點擊時才阻止預設行為
      e.stopPropagation();
      lastTouchTime.current = Date.now(); // 記錄觸摸時間，防止後續 click 觸發
      onToggle();
    }
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
          ${isHighlighted && !isActive ? 'bg-yellow-200 dark:bg-yellow-600/40 px-1 py-0.5 font-semibold' : ''}
        `}>
          {unit.content}
        </span>

        {/* Mobile: show below, Desktop: show above */}
        <span className={`
          absolute z-50
          top-full sm:bottom-full sm:top-auto
          left-1/2 -translate-x-1/2
          mt-3 sm:mt-0 sm:mb-3
          px-4 py-3 bg-gray-900 dark:bg-gray-100
          text-white dark:text-gray-900 rounded-lg shadow-2xl
          w-[200px] sm:w-auto sm:min-w-[120px] sm:max-w-[300px]
          ${isActive ? 'visible opacity-100' : 'invisible opacity-0'}
          transition-opacity duration-200
        `}>
          <div className="font-bold text-base text-center whitespace-normal break-words">{unit.translation}</div>
          {unit.explanation && (
            <div className="text-gray-400 dark:text-gray-500 text-xs whitespace-normal break-words text-center border-t border-gray-700 dark:border-gray-300 pt-2 mt-2">
              {unit.explanation}
            </div>
          )}
          {/* Arrow: point up on mobile, down on desktop */}
          <span className="absolute bottom-full sm:bottom-auto sm:top-full left-1/2 -translate-x-1/2 -mb-1.5 sm:mb-0 sm:-mt-1.5 border-[6px] border-transparent border-b-gray-900 dark:border-b-gray-100 sm:border-b-transparent sm:border-t-gray-900 sm:dark:border-t-gray-100" />
        </span>
      </span>
      {/* 真實空格 */}
      {' '}
    </>
  );
});
