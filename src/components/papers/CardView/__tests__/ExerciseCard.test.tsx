import { render, screen, within } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import ExerciseCard from '../ExerciseCard';
import { usePaperStore } from '@/stores/usePaperStore';
import type { Exercise } from '@/types/paper';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock react-swipeable
vi.mock('react-swipeable', () => ({
  useSwipeable: () => ({}),
}));

// Mock child components
vi.mock('../../exercises/MCQExercise', () => ({
  MCQExercise: ({ exercise }: any) => (
    <div data-testid="mcq-exercise">MCQ: {exercise.question}</div>
  ),
}));

vi.mock('../../exercises/ClozeExercise', () => ({
  ClozeExercise: ({ exercise }: any) => (
    <div data-testid="cloze-exercise">Cloze: {exercise.question}</div>
  ),
}));

vi.mock('../../exercises/ItemSetExercise', () => ({
  ItemSetExercise: ({ exercise }: any) => (
    <div data-testid="itemset-exercise">ItemSet: {exercise.question}</div>
  ),
}));

vi.mock('../../assets/AssetDisplay', () => ({
  default: ({ asset }: any) => {
    // 模擬 passage 類型返回 null
    if ('passage' in asset) {
      return null;
    }
    return <div data-testid="asset-display">Asset: {asset.type}</div>;
  },
}));

// Helper: 建立 mock exercise
const createMockExercise = (exerciseTypeId: number, includeAsset: boolean = false): Exercise => ({
  id: 1,
  exercise_type_id: exerciseTypeId,
  exercise_type: {
    id: exerciseTypeId,
    name: `Type ${exerciseTypeId}`,
  },
  difficulty_bundle_id: 1,
  question: 'Test Question',
  exercise_items: [
    {
      id: 10,
      exercise_id: 1,
      question: 'Test Item',
      options: [
        { id: 1, content: 'A', is_correct: true },
        { id: 2, content: 'B', is_correct: false },
        { id: 3, content: 'C', is_correct: false },
        { id: 4, content: 'D', is_correct: false },
      ],
    },
  ],
  asset_json: includeAsset ? { type: 'menu', content: {} } : undefined,
});

describe('ExerciseCard', () => {
  beforeEach(() => {
    // 重置 store
    usePaperStore.setState({
      mode: 'pending',
      answers: new Map(),
      navigationDirection: 'right',
    });
  });

  describe('基本渲染', () => {
    it('應該顯示題號', () => {
      const exercise = createMockExercise(1);

      render(<ExerciseCard exercise={exercise} index={0} />);

      expect(screen.getByText('第 1 題')).toBeInTheDocument();
    });

    it('應該顯示題型標籤', () => {
      const exercise = createMockExercise(1);

      render(<ExerciseCard exercise={exercise} index={0} />);

      expect(screen.getByText('Type 1')).toBeInTheDocument();
    });

    it('有 asset 時應該顯示 AssetDisplay', () => {
      const exercise = createMockExercise(1, true);

      render(<ExerciseCard exercise={exercise} index={0} />);

      expect(screen.getByTestId('asset-display')).toBeInTheDocument();
      expect(screen.getByText('Asset: menu')).toBeInTheDocument();
    });

    it('沒有 asset 時不應該顯示 AssetDisplay', () => {
      const exercise = createMockExercise(1, false);

      render(<ExerciseCard exercise={exercise} index={0} />);

      expect(screen.queryByTestId('asset-display')).not.toBeInTheDocument();
    });
  });

  describe('題型渲染', () => {
    it('應該渲染 MCQ 題型 (type_id = 1)', () => {
      const exercise = createMockExercise(1);

      render(<ExerciseCard exercise={exercise} index={0} />);

      expect(screen.getByTestId('mcq-exercise')).toBeInTheDocument();
      expect(screen.getByText('MCQ: Test Question')).toBeInTheDocument();
    });

    it('應該渲染 MCQ 題型 (type_id = 2)', () => {
      const exercise = createMockExercise(2);

      render(<ExerciseCard exercise={exercise} index={0} />);

      expect(screen.getByTestId('mcq-exercise')).toBeInTheDocument();
    });

    it('應該渲染 MCQ 題型 (type_id = 3)', () => {
      const exercise = createMockExercise(3);

      render(<ExerciseCard exercise={exercise} index={0} />);

      expect(screen.getByTestId('mcq-exercise')).toBeInTheDocument();
    });

    it('應該渲染 Cloze 題型 (type_id = 4)', () => {
      const exercise = createMockExercise(4);

      render(<ExerciseCard exercise={exercise} index={0} />);

      expect(screen.getByTestId('cloze-exercise')).toBeInTheDocument();
      expect(screen.getByText('Cloze: Test Question')).toBeInTheDocument();
    });

    it('應該渲染 ItemSet 題型 (type_id = 5)', () => {
      const exercise = createMockExercise(5);

      render(<ExerciseCard exercise={exercise} index={0} />);

      expect(screen.getByTestId('itemset-exercise')).toBeInTheDocument();
      expect(screen.getByText('ItemSet: Test Question')).toBeInTheDocument();
    });

    it('應該渲染 ItemSet 題型 (type_id = 6-12)', () => {
      for (let typeId = 6; typeId <= 12; typeId++) {
        const exercise = createMockExercise(typeId);
        const { unmount } = render(<ExerciseCard exercise={exercise} index={0} />);

        expect(screen.getByTestId('itemset-exercise')).toBeInTheDocument();

        unmount();
      }
    });

    it('不支援的題型應該顯示錯誤訊息', () => {
      const exercise = createMockExercise(99);

      render(<ExerciseCard exercise={exercise} index={0} />);

      expect(screen.getByText('不支援的題型 ID：99')).toBeInTheDocument();
    });
  });

  describe('動畫方向', () => {
    it('direction=right 時應該從右側進入', () => {
      usePaperStore.setState({ navigationDirection: 'right' });
      const exercise = createMockExercise(1);

      const { container } = render(<ExerciseCard exercise={exercise} index={0} />);

      // 檢查 motion.div 有被渲染
      const motionDiv = container.firstChild;
      expect(motionDiv).toBeInTheDocument();
    });

    it('direction=left 時應該從左側進入', () => {
      usePaperStore.setState({ navigationDirection: 'left' });
      const exercise = createMockExercise(1);

      const { container } = render(<ExerciseCard exercise={exercise} index={0} />);

      const motionDiv = container.firstChild;
      expect(motionDiv).toBeInTheDocument();
    });
  });

  describe('響應式設計', () => {
    it('應該有 responsive padding classes', () => {
      const exercise = createMockExercise(1);

      const { container } = render(<ExerciseCard exercise={exercise} index={0} />);

      const motionDiv = container.firstChild as HTMLElement;
      expect(motionDiv.className).toContain('px-4');
      expect(motionDiv.className).toContain('md:px-6');
      expect(motionDiv.className).toContain('py-6');
      expect(motionDiv.className).toContain('md:py-8');
    });

    it('題號應該有 responsive font size', () => {
      const exercise = createMockExercise(1);

      render(<ExerciseCard exercise={exercise} index={0} />);

      const title = screen.getByText('第 1 題');
      expect(title.className).toContain('text-xl');
      expect(title.className).toContain('md:text-2xl');
    });
  });

  describe('整合測試', () => {
    it('應該完整渲染所有元素 (MCQ 題型 + 有 asset)', () => {
      const exercise = createMockExercise(1, true);

      render(<ExerciseCard exercise={exercise} index={5} />);

      // 題號
      expect(screen.getByText('第 6 題')).toBeInTheDocument();

      // 題型標籤
      expect(screen.getByText('Type 1')).toBeInTheDocument();

      // Asset
      expect(screen.getByTestId('asset-display')).toBeInTheDocument();

      // 題目內容
      expect(screen.getByTestId('mcq-exercise')).toBeInTheDocument();
    });

    it('應該完整渲染所有元素 (Cloze 題型 + 無 asset)', () => {
      const exercise = createMockExercise(4, false);

      render(<ExerciseCard exercise={exercise} index={10} />);

      // 題號
      expect(screen.getByText('第 11 題')).toBeInTheDocument();

      // 題型標籤
      expect(screen.getByText('Type 4')).toBeInTheDocument();

      // 沒有 Asset
      expect(screen.queryByTestId('asset-display')).not.toBeInTheDocument();

      // 題目內容
      expect(screen.getByTestId('cloze-exercise')).toBeInTheDocument();
    });
  });
});
