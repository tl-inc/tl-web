/**
 * useSwipeGesture Hook
 * 
 * 處理卡片式 UI 的滑動手勢邏輯
 */

import { useRef } from 'react';

interface UseSwipeGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  enabled?: boolean;
  minSwipeDistance?: number;
}

export function useSwipeGesture({
  onSwipeLeft,
  onSwipeRight,
  enabled = true,
  minSwipeDistance = 80,
}: UseSwipeGestureOptions = {}) {
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const touchEndY = useRef<number>(0);
  const isSwiping = useRef<boolean>(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;
    isSwiping.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;

    // 檢查是否有明顯的滑動動作（移動距離超過 10px）
    const deltaX = Math.abs(touchEndX.current - touchStartX.current);
    const deltaY = Math.abs(touchEndY.current - touchStartY.current);

    if (deltaX > 10 || deltaY > 10) {
      isSwiping.current = true;
    }
  };

  const handleTouchEnd = () => {
    // 如果功能未啟用，不處理
    if (!enabled) return;

    // 如果沒有滑動動作（只是點擊），不處理
    if (!isSwiping.current) return;

    const swipeDistanceX = touchStartX.current - touchEndX.current;
    const swipeDistanceY = Math.abs(touchStartY.current - touchEndY.current);

    // 確保是水平滑動而不是垂直滑動（水平距離要大於垂直距離）
    if (Math.abs(swipeDistanceX) <= swipeDistanceY) return;

    // 向左滑動
    if (swipeDistanceX > minSwipeDistance && onSwipeLeft) {
      onSwipeLeft();
    }
    // 向右滑動
    else if (swipeDistanceX < -minSwipeDistance && onSwipeRight) {
      onSwipeRight();
    }

    // 重置狀態
    isSwiping.current = false;
  };

  return {
    cardRef,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  };
}
