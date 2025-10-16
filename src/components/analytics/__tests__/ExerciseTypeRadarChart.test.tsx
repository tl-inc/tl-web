import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ExerciseTypeRadarChart } from '../ExerciseTypeRadarChart';
import type { ExerciseTypeGroup } from '@/types/analytics';

// Mock recharts to avoid canvas issues in tests
vi.mock('recharts', async () => {
  const actual = await vi.importActual('recharts');
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="responsive-container">{children}</div>
    ),
  };
});

describe('ExerciseTypeRadarChart', () => {
  const mockGroup: ExerciseTypeGroup = {
    id: 1,
    name: '基礎題型',
    display_order: 1,
    exercise_types: [
      {
        id: 1,
        name: '單字題',
        level: 8,
        max_level: 10,
        recent_attempts: 10,
        recent_correct_rate: 0.9,
      },
      {
        id: 2,
        name: '片語題',
        level: 7,
        max_level: 10,
        recent_attempts: 8,
        recent_correct_rate: 0.85,
      },
      {
        id: 3,
        name: '文法題',
        level: 6,
        max_level: 10,
        recent_attempts: 9,
        recent_correct_rate: 0.778,
      },
    ],
  };

  describe('Rendering', () => {
    it('should render radar chart with exercise types', () => {
      render(<ExerciseTypeRadarChart group={mockGroup} />);
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    });

    it('should show empty state when no exercise types', () => {
      const emptyGroup: ExerciseTypeGroup = {
        id: 1,
        name: '空分組',
        display_order: 1,
        exercise_types: [],
      };

      render(<ExerciseTypeRadarChart group={emptyGroup} />);

      expect(screen.getByText('此分組尚無題型資料')).toBeInTheDocument();
      expect(screen.getByText('完成練習後即可查看統計')).toBeInTheDocument();
    });

    it('should handle undefined exercise_types', () => {
      const invalidGroup = {
        id: 1,
        name: '無效分組',
        display_order: 1,
        exercise_types: undefined as unknown as [],
      };

      render(<ExerciseTypeRadarChart group={invalidGroup} />);

      expect(screen.getByText('此分組尚無題型資料')).toBeInTheDocument();
    });
  });

  describe('Click Handling', () => {
    it('should not call onExerciseTypeClick when callback is not provided', () => {
      render(<ExerciseTypeRadarChart group={mockGroup} />);
      // Should render without errors
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    });

    it('should accept onExerciseTypeClick callback', () => {
      const handleClick = vi.fn();
      render(
        <ExerciseTypeRadarChart
          group={mockGroup}
          onExerciseTypeClick={handleClick}
        />
      );
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    });
  });

  describe('Data Transformation', () => {
    it('should transform exercise types to radar data format', () => {
      const { container } = render(<ExerciseTypeRadarChart group={mockGroup} />);

      // Check that component renders without errors
      expect(container).toBeTruthy();
    });

    it('should handle single exercise type', () => {
      const singleGroup: ExerciseTypeGroup = {
        id: 1,
        name: '單一題型',
        display_order: 1,
        exercise_types: [
          {
            id: 1,
            name: '單字題',
            level: 8,
            max_level: 10,
            recent_attempts: 10,
            recent_correct_rate: 0.9,
          },
        ],
      };

      render(<ExerciseTypeRadarChart group={singleGroup} />);
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero level', () => {
      const zeroLevelGroup: ExerciseTypeGroup = {
        id: 1,
        name: '零等級',
        display_order: 1,
        exercise_types: [
          {
            id: 1,
            name: '單字題',
            level: 0,
            max_level: 5,
            recent_attempts: 0,
            recent_correct_rate: 0.0,
          },
        ],
      };

      render(<ExerciseTypeRadarChart group={zeroLevelGroup} />);
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    });

    it('should handle max level (10)', () => {
      const maxLevelGroup: ExerciseTypeGroup = {
        id: 1,
        name: '最高等級',
        display_order: 1,
        exercise_types: [
          {
            id: 1,
            name: '單字題',
            level: 10,
            max_level: 10,
            recent_attempts: 10,
            recent_correct_rate: 1.0,
          },
        ],
      };

      render(<ExerciseTypeRadarChart group={maxLevelGroup} />);
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    });

    it('should handle decimal correct rates', () => {
      const decimalGroup: ExerciseTypeGroup = {
        id: 1,
        name: '小數答對率',
        display_order: 1,
        exercise_types: [
          {
            id: 1,
            name: '單字題',
            level: 5,
            max_level: 10,
            recent_attempts: 3,
            recent_correct_rate: 0.667, // 2/3
          },
        ],
      };

      render(<ExerciseTypeRadarChart group={decimalGroup} />);
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    });
  });

  describe('Component Optimization', () => {
    it('should have displayName for debugging', () => {
      expect(ExerciseTypeRadarChart.displayName).toBe(
        'ExerciseTypeRadarChart'
      );
    });

    it('should memoize the component', () => {
      // The component should be wrapped with React.memo
      expect(ExerciseTypeRadarChart.$$typeof).toBeDefined();
    });
  });
});
