import { render, screen, within } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import user from '@testing-library/user-event';
import NavigationPanel from '../NavigationPanel';
import { usePaperStore } from '@/stores/usePaperStore';
import type { PaperData, Exercise } from '@/types/paper';

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  X: () => <div data-testid="x-icon">X</div>,
  Check: () => <div data-testid="check-icon">Check</div>,
  Circle: () => <div data-testid="circle-icon">Circle</div>,
  AlertCircle: () => <div data-testid="alert-icon">Alert</div>,
  AlertTriangle: () => <div data-testid="alert-triangle-icon">AlertTriangle</div>,
  Bookmark: () => <div data-testid="bookmark-icon">Bookmark</div>,
  Filter: () => <div data-testid="filter-icon">Filter</div>,
}));

// Helper: 建立 mock paper
const createMockPaper = (exerciseCount: number = 5): PaperData => ({
  id: 1,
  range_pack_id: 1,
  blueprint_id: 1,
  exercises: Array.from({ length: exerciseCount }, (_, i) => ({
    id: i + 1,
    exercise_type_id: 1,
    exercise_type: { id: 1, name: 'MCQ' },
    subject_id: 1,
    difficulty_bundle_id: 1,
    passage: null,
    audio_url: null,
    image_url: null,
    asset_json: null,
    created_at: new Date().toISOString(),
    question: `Question ${i + 1}`,
    exercise_items: [
      {
        id: (i + 1) * 10,
        exercise_id: i + 1,
        sequence: 1,
        question: `Item ${i + 1}`,
        options: [
          { text: 'A', is_correct: true },
          { text: 'B', is_correct: false },
        ],
      },
    ],
  } as Exercise)),
  total_items: exerciseCount,
  created_at: new Date().toISOString(),
});

describe('NavigationPanel', () => {
  beforeEach(() => {
    // 重置 store
    usePaperStore.setState({
      paper: null,
      mode: 'pending',
      answers: new Map(),
      currentExerciseIndex: 0,
      markedExercises: new Set(),
    });
  });

  describe('基本渲染', () => {
    it('paper 為 null 時不應該渲染', () => {
      usePaperStore.setState({ paper: null });

      const { container } = render(<NavigationPanel />);

      expect(container.firstChild).toBeNull();
    });

    it('應該顯示標題', () => {
      usePaperStore.setState({ paper: createMockPaper(3) });

      render(<NavigationPanel />);

      expect(screen.getByText('題目導航')).toBeInTheDocument();
    });

    it('應該顯示關閉按鈕', () => {
      usePaperStore.setState({ paper: createMockPaper(3) });

      render(<NavigationPanel />);

      expect(screen.getByLabelText('關閉導航面板')).toBeInTheDocument();
    });

    it('應該顯示所有題目', () => {
      usePaperStore.setState({ paper: createMockPaper(5) });

      render(<NavigationPanel />);

      expect(screen.getByText('#1')).toBeInTheDocument();
      expect(screen.getByText('#2')).toBeInTheDocument();
      expect(screen.getByText('#3')).toBeInTheDocument();
      expect(screen.getByText('#4')).toBeInTheDocument();
      expect(screen.getByText('#5')).toBeInTheDocument();
    });
  });

  describe('進度統計', () => {
    it('pending 模式：應該顯示進度', () => {
      const paper = createMockPaper(5);
      usePaperStore.setState({
        paper,
        mode: 'pending',
        answers: new Map(),
      });

      render(<NavigationPanel />);

      expect(screen.getByText('進度：')).toBeInTheDocument();
      expect(screen.getByText('0 / 5')).toBeInTheDocument();
    });

    it('pending 模式：不應該顯示正確率', () => {
      usePaperStore.setState({
        paper: createMockPaper(5),
        mode: 'pending',
      });

      render(<NavigationPanel />);

      expect(screen.queryByText('正確率：')).not.toBeInTheDocument();
    });

    it('in_progress 模式：應該顯示已答題數', () => {
      const paper = createMockPaper(5);
      const answers = new Map([[10, 0], [20, 1]]); // 2 題已答

      usePaperStore.setState({
        paper,
        mode: 'in_progress',
        answers,
      });

      render(<NavigationPanel />);

      expect(screen.getByText('2 / 5')).toBeInTheDocument();
    });

    it('completed 模式：應該顯示進度和正確率', () => {
      const paper = createMockPaper(5);
      // 假設全對
      const answers = new Map([
        [10, 0], // correct
        [20, 0], // correct
        [30, 0], // correct
      ]);

      usePaperStore.setState({
        paper,
        mode: 'completed',
        answers,
      });

      render(<NavigationPanel />);

      expect(screen.getByText('3 / 5')).toBeInTheDocument();
      expect(screen.getByText('正確率：')).toBeInTheDocument();
      expect(screen.getByText('60%')).toBeInTheDocument(); // 3/5 = 60%
    });
  });

  describe('狀態感知 - pending/in_progress 模式', () => {
    it('應該顯示「未答」狀態', () => {
      usePaperStore.setState({
        paper: createMockPaper(3),
        mode: 'in_progress',
        answers: new Map(),
      });

      render(<NavigationPanel />);

      // 檢查所有題目按鈕中包含「未答」文字
      expect(screen.getByText('#1').closest('button')?.textContent).toContain('未答');
      expect(screen.getByText('#2').closest('button')?.textContent).toContain('未答');
      expect(screen.getByText('#3').closest('button')?.textContent).toContain('未答');
    });

    it('應該顯示「已答」狀態', () => {
      const paper = createMockPaper(3);
      const answers = new Map([[10, 0]]); // 第一題已答

      usePaperStore.setState({
        paper,
        mode: 'in_progress',
        answers,
      });

      render(<NavigationPanel />);

      // 第一題已答
      expect(screen.getByText('#1').closest('button')?.textContent).toContain('已答');
      // 其他題目未答
      expect(screen.getByText('#2').closest('button')?.textContent).toContain('未答');
      expect(screen.getByText('#3').closest('button')?.textContent).toContain('未答');
    });

    it('in_progress 模式：不應該顯示正確/錯誤', () => {
      const paper = createMockPaper(3);
      const answers = new Map([
        [10, 0], // 答對
        [20, 1], // 答錯
      ]);

      usePaperStore.setState({
        paper,
        mode: 'in_progress',
        answers,
      });

      render(<NavigationPanel />);

      // 檢查題目按鈕中不應該包含「正確」或「錯誤」
      const button1 = screen.getByText('#1').closest('button');
      const button2 = screen.getByText('#2').closest('button');

      expect(button1?.textContent).not.toContain('正確');
      expect(button1?.textContent).not.toContain('錯誤');
      expect(button2?.textContent).not.toContain('正確');
      expect(button2?.textContent).not.toContain('錯誤');
    });

    it('應該顯示底部提示「作答中不顯示正確性」', () => {
      usePaperStore.setState({
        paper: createMockPaper(3),
        mode: 'in_progress',
      });

      render(<NavigationPanel />);

      expect(screen.getByText('作答中不顯示正確性')).toBeInTheDocument();
    });
  });

  describe('狀態感知 - completed/abandoned 模式', () => {
    it('應該顯示「正確」狀態', () => {
      const paper = createMockPaper(3);
      const answers = new Map([[10, 0]]); // 第一題答對

      usePaperStore.setState({
        paper,
        mode: 'completed',
        answers,
      });

      render(<NavigationPanel />);

      const button1 = screen.getByText('#1').closest('button');
      expect(button1?.textContent).toContain('正確');
    });

    it('應該顯示「錯誤」狀態', () => {
      const paper = createMockPaper(3);
      const answers = new Map([[10, 1]]); // 第一題答錯 (option 1 is wrong)

      usePaperStore.setState({
        paper,
        mode: 'completed',
        answers,
      });

      render(<NavigationPanel />);

      const button1 = screen.getByText('#1').closest('button');
      expect(button1?.textContent).toContain('錯誤');
    });

    it('應該顯示底部提示「點擊題目快速跳轉」', () => {
      usePaperStore.setState({
        paper: createMockPaper(3),
        mode: 'completed',
      });

      render(<NavigationPanel />);

      expect(screen.getByText('點擊題目快速跳轉')).toBeInTheDocument();
    });
  });

  describe('篩選功能', () => {
    it('預設應該顯示「全部」篩選器', () => {
      usePaperStore.setState({
        paper: createMockPaper(3),
        mode: 'in_progress',
      });

      render(<NavigationPanel />);

      expect(screen.getByText('全部')).toBeInTheDocument();
      expect(screen.getAllByText('未答').length).toBeGreaterThan(0);
      expect(screen.getAllByText('已答').length).toBeGreaterThan(0);
      expect(screen.getByText('已標記')).toBeInTheDocument();
    });

    it('in_progress 模式：不應該顯示「答對」「答錯」篩選器', () => {
      usePaperStore.setState({
        paper: createMockPaper(3),
        mode: 'in_progress',
      });

      render(<NavigationPanel />);

      expect(screen.queryByText('答對')).not.toBeInTheDocument();
      expect(screen.queryByText('答錯')).not.toBeInTheDocument();
    });

    it('completed 模式：應該顯示「答對」「答錯」篩選器', () => {
      usePaperStore.setState({
        paper: createMockPaper(3),
        mode: 'completed',
      });

      render(<NavigationPanel />);

      // 檢查篩選按鈕中有這些文字
      const filterButtons = screen.getAllByRole('button');
      const filterTexts = filterButtons.map(btn => btn.textContent);
      expect(filterTexts.some(text => text?.includes('答對'))).toBe(true);
      expect(filterTexts.some(text => text?.includes('答錯'))).toBe(true);
    });

    it('點擊篩選器應該只顯示對應題目', async () => {
      const paper = createMockPaper(5);
      const answers = new Map([[10, 0], [20, 0]]); // 前 2 題已答

      usePaperStore.setState({
        paper,
        mode: 'in_progress',
        answers,
      });

      render(<NavigationPanel />);

      // 點擊「已答」篩選按鈕（在篩選器區域中的按鈕）
      const allButtons = screen.getAllByRole('button');
      const answeredFilterButton = allButtons.find(btn =>
        btn.textContent === '已答' && btn.className.includes('rounded px-2 py-1')
      );

      if (answeredFilterButton) {
        await user.click(answeredFilterButton);
      }

      // 應該只顯示 2 個題目 (#1 和 #2)
      expect(screen.getByText('#1')).toBeInTheDocument();
      expect(screen.getByText('#2')).toBeInTheDocument();
      expect(screen.queryByText('#3')).not.toBeInTheDocument();
    });
  });

  describe('標記功能', () => {
    it('已標記的題目應該顯示書籤圖示', () => {
      const markedExercises = new Set([1, 3]); // 標記第 1 和第 3 題

      usePaperStore.setState({
        paper: createMockPaper(5),
        mode: 'in_progress',
        markedExercises,
      });

      render(<NavigationPanel />);

      const bookmarks = screen.getAllByTestId('bookmark-icon');
      expect(bookmarks).toHaveLength(2);
    });

    it('點擊「已標記」篩選應該只顯示標記的題目', async () => {
      const markedExercises = new Set([1, 3]);

      usePaperStore.setState({
        paper: createMockPaper(5),
        mode: 'in_progress',
        markedExercises,
      });

      render(<NavigationPanel />);

      // 點擊「已標記」篩選
      const markedButton = screen.getByText('已標記');
      await user.click(markedButton);

      // 應該只顯示 2 個題目
      const exerciseButtons = screen.getAllByRole('button').filter((btn) =>
        btn.textContent?.includes('#')
      );
      expect(exerciseButtons).toHaveLength(2);
    });
  });

  describe('當前題目高亮', () => {
    it('應該高亮當前題目', () => {
      usePaperStore.setState({
        paper: createMockPaper(5),
        mode: 'in_progress',
        currentExerciseIndex: 2, // 第 3 題
      });

      render(<NavigationPanel />);

      const button3 = screen.getByText('#3').closest('button');
      expect(button3?.className).toContain('bg-blue-100');
    });
  });

  describe('互動行為', () => {
    it('點擊題目應該跳轉', async () => {
      const jumpToExercise = vi.fn();
      usePaperStore.setState({
        paper: createMockPaper(5),
        mode: 'in_progress',
      });

      // Mock jumpToExercise
      usePaperStore.setState({ jumpToExercise });

      render(<NavigationPanel />);

      // 點擊第 3 題
      const button3 = screen.getByText('#3').closest('button')!;
      await user.click(button3);

      expect(jumpToExercise).toHaveBeenCalledWith(2); // index 2 = 第 3 題
    });

    it('點擊關閉按鈕應該觸發 toggleNavigationPanel', async () => {
      const toggleNavigationPanel = vi.fn();
      usePaperStore.setState({
        paper: createMockPaper(3),
        mode: 'in_progress',
        toggleNavigationPanel,
      });

      render(<NavigationPanel />);

      const closeButton = screen.getByLabelText('關閉導航面板');
      await user.click(closeButton);

      expect(toggleNavigationPanel).toHaveBeenCalled();
    });
  });

  describe('響應式資訊', () => {
    it('應該顯示每題的小題數量', () => {
      usePaperStore.setState({
        paper: createMockPaper(3),
        mode: 'in_progress',
      });

      render(<NavigationPanel />);

      const labels = screen.getAllByText('1小題');
      expect(labels).toHaveLength(3); // 每題都有 1 個 exercise_item
    });
  });
});
