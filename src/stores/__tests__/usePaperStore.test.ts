import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { usePaperStore } from '../usePaperStore';
import type { PaperData } from '@/types/paper';

// Helper: 建立 mock paper 資料
const createMockPaper = (exerciseCount: number = 10): PaperData => ({
  id: 1,
  range_pack_id: 1,
  blueprint_id: 1,
  exercises: Array.from({ length: exerciseCount }, (_, i) => ({
    id: i + 1,
    exercise_type_id: 1,
    difficulty_bundle_id: 1,
    question: `Question ${i + 1}`,
    exercise_items: [
      {
        id: (i + 1) * 10,
        exercise_id: i + 1,
        question: `Item ${i + 1}`,
        options: [
          { id: 1, content: 'A', is_correct: true },
          { id: 2, content: 'B', is_correct: false },
          { id: 3, content: 'C', is_correct: false },
          { id: 4, content: 'D', is_correct: false },
        ],
      },
    ],
  })),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('usePaperStore - Card View功能', () => {
  beforeEach(() => {
    // 重置 store
    const { result } = renderHook(() => usePaperStore());
    act(() => {
      result.current.reset();
    });

    // 清空 localStorage
    localStorageMock.clear();
  });

  describe('View Mode 切換', () => {
    it('預設應該是 scroll 模式', () => {
      const { result } = renderHook(() => usePaperStore());
      expect(result.current.viewMode).toBe('scroll');
    });

    it('應該能切換到 card 模式', () => {
      const { result } = renderHook(() => usePaperStore());

      act(() => {
        result.current.setViewMode('card');
      });

      expect(result.current.viewMode).toBe('card');
    });

    // Note: localStorage persistence has been removed in favor of potential zustand persist middleware
    // These tests are skipped but kept for reference if persistence is re-added
    it.skip('切換模式時應該存入 localStorage', () => {
      const { result } = renderHook(() => usePaperStore());

      act(() => {
        result.current.setViewMode('card');
      });

      expect(localStorageMock.getItem('paperViewMode')).toBe('card');
    });

    it.skip('從 localStorage 恢復模式', () => {
      localStorageMock.setItem('paperViewMode', 'card');

      const { result } = renderHook(() => usePaperStore());

      // 初始化後應該從 localStorage 讀取
      act(() => {
        result.current.setViewMode(
          (localStorageMock.getItem('paperViewMode') as 'scroll' | 'card') || 'scroll'
        );
      });

      expect(result.current.viewMode).toBe('card');
    });
  });

  describe('題目導航', () => {
    it('預設當前題目索引應該是 0', () => {
      const { result } = renderHook(() => usePaperStore());
      expect(result.current.currentExerciseIndex).toBe(0);
    });

    it('nextExercise 應該增加索引並設定方向為 right', () => {
      const { result } = renderHook(() => usePaperStore());

      // 設定 mock paper
      act(() => {
        result.current.setPaper(createMockPaper(10));
        result.current.nextExercise();
      });

      expect(result.current.currentExerciseIndex).toBe(1);
      expect(result.current.navigationDirection).toBe('right');
    });

    it('previousExercise 應該減少索引並設定方向為 left', () => {
      const { result } = renderHook(() => usePaperStore());

      // 設定 mock paper 並移到第 2 題
      act(() => {
        result.current.setPaper(createMockPaper(10));
        result.current.nextExercise();
        result.current.nextExercise();
      });

      // 再往前
      act(() => {
        result.current.previousExercise();
      });

      expect(result.current.currentExerciseIndex).toBe(1);
      expect(result.current.navigationDirection).toBe('left');
    });

    it('previousExercise 在第一題時不應該變成負數', () => {
      const { result } = renderHook(() => usePaperStore());

      act(() => {
        result.current.previousExercise();
      });

      expect(result.current.currentExerciseIndex).toBe(0);
    });

    it('jumpToExercise 應該正確跳轉並設定方向', () => {
      const { result } = renderHook(() => usePaperStore());

      // 設定 mock paper 並從第 0 題跳到第 5 題（往右）
      act(() => {
        result.current.setPaper(createMockPaper(10));
        result.current.jumpToExercise(5);
      });

      expect(result.current.currentExerciseIndex).toBe(5);
      expect(result.current.navigationDirection).toBe('right');
    });

    it('jumpToExercise 往前跳應該設定方向為 left', () => {
      const { result } = renderHook(() => usePaperStore());

      // 設定 mock paper
      act(() => {
        result.current.setPaper(createMockPaper(15));
      });

      // 先跳到第 10 題
      act(() => {
        result.current.jumpToExercise(10);
      });

      // 再跳回第 3 題（往左）
      act(() => {
        result.current.jumpToExercise(3);
      });

      expect(result.current.currentExerciseIndex).toBe(3);
      expect(result.current.navigationDirection).toBe('left');
    });

    it('jumpToExercise 跳到同一題時應該保持當前方向', () => {
      const { result } = renderHook(() => usePaperStore());

      // 先設定一個方向
      act(() => {
        result.current.nextExercise(); // direction = 'right'
      });

      const previousDirection = result.current.navigationDirection;

      // 跳到同一題
      act(() => {
        result.current.jumpToExercise(1);
      });

      expect(result.current.navigationDirection).toBe(previousDirection);
    });
  });

  describe('題目標記', () => {
    it('預設應該沒有標記的題目', () => {
      const { result } = renderHook(() => usePaperStore());
      expect(result.current.markedExercises.size).toBe(0);
    });

    it('應該能標記題目', () => {
      const { result } = renderHook(() => usePaperStore());

      act(() => {
        result.current.toggleMarkExercise(5);
      });

      expect(result.current.markedExercises.has(5)).toBe(true);
    });

    it('再次切換應該取消標記', () => {
      const { result } = renderHook(() => usePaperStore());

      // 標記
      act(() => {
        result.current.toggleMarkExercise(5);
      });

      // 取消標記
      act(() => {
        result.current.toggleMarkExercise(5);
      });

      expect(result.current.markedExercises.has(5)).toBe(false);
    });

    it('應該能標記多個題目', () => {
      const { result } = renderHook(() => usePaperStore());

      act(() => {
        result.current.toggleMarkExercise(1);
        result.current.toggleMarkExercise(3);
        result.current.toggleMarkExercise(5);
      });

      expect(result.current.markedExercises.size).toBe(3);
      expect(result.current.markedExercises.has(1)).toBe(true);
      expect(result.current.markedExercises.has(3)).toBe(true);
      expect(result.current.markedExercises.has(5)).toBe(true);
    });
  });

  describe('導航面板', () => {
    it('預設應該是關閉的', () => {
      const { result } = renderHook(() => usePaperStore());
      expect(result.current.isNavigationPanelOpen).toBe(false);
    });

    it('應該能開啟導航面板', () => {
      const { result } = renderHook(() => usePaperStore());

      act(() => {
        result.current.toggleNavigationPanel();
      });

      expect(result.current.isNavigationPanelOpen).toBe(true);
    });

    it('再次切換應該關閉導航面板', () => {
      const { result } = renderHook(() => usePaperStore());

      // 開啟
      act(() => {
        result.current.toggleNavigationPanel();
      });

      // 關閉
      act(() => {
        result.current.toggleNavigationPanel();
      });

      expect(result.current.isNavigationPanelOpen).toBe(false);
    });
  });

  describe('整合測試 - 完整流程', () => {
    it('應該能完成完整的卡片導航流程', () => {
      const { result } = renderHook(() => usePaperStore());

      // 0. 設定 mock paper
      act(() => {
        result.current.setPaper(createMockPaper(10));
      });

      // 1. 切換到卡片模式
      act(() => {
        result.current.setViewMode('card');
      });
      expect(result.current.viewMode).toBe('card');

      // 2. 標記第一題
      act(() => {
        result.current.toggleMarkExercise(0);
      });
      expect(result.current.markedExercises.has(0)).toBe(true);

      // 3. 下一題
      act(() => {
        result.current.nextExercise();
      });
      expect(result.current.currentExerciseIndex).toBe(1);
      expect(result.current.navigationDirection).toBe('right');

      // 4. 再下一題
      act(() => {
        result.current.nextExercise();
      });
      expect(result.current.currentExerciseIndex).toBe(2);

      // 5. 標記第三題
      act(() => {
        result.current.toggleMarkExercise(2);
      });
      expect(result.current.markedExercises.has(2)).toBe(true);

      // 6. 開啟導航面板
      act(() => {
        result.current.toggleNavigationPanel();
      });
      expect(result.current.isNavigationPanelOpen).toBe(true);

      // 7. 跳到第一題（往左）
      act(() => {
        result.current.jumpToExercise(0);
      });
      expect(result.current.currentExerciseIndex).toBe(0);
      expect(result.current.navigationDirection).toBe('left');

      // 8. 檢查標記狀態仍然保留
      expect(result.current.markedExercises.size).toBe(2);
      expect(result.current.markedExercises.has(0)).toBe(true);
      expect(result.current.markedExercises.has(2)).toBe(true);
    });
  });

  describe('邊界測試', () => {
    it('jumpToExercise 接受負數時應該跳到第一題', () => {
      const { result } = renderHook(() => usePaperStore());

      act(() => {
        result.current.jumpToExercise(-5);
      });

      expect(result.current.currentExerciseIndex).toBe(0);
    });

    it('連續快速切換方向應該正確更新', () => {
      const { result } = renderHook(() => usePaperStore());

      // 設定 mock paper
      act(() => {
        result.current.setPaper(createMockPaper(10));
      });

      act(() => {
        result.current.nextExercise();
        result.current.nextExercise();
        result.current.previousExercise();
        result.current.nextExercise();
      });

      expect(result.current.currentExerciseIndex).toBe(2);
      expect(result.current.navigationDirection).toBe('right');
    });
  });
});
