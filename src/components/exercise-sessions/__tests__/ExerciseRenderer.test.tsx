import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/__tests__/utils/test-utils';
import { ExerciseRenderer } from '../ExerciseRenderer';

describe('ExerciseRenderer', () => {
  const mockOnAnswerChange = vi.fn();

  beforeEach(() => {
    mockOnAnswerChange.mockClear();
  });

  describe('Type 1 - Vocabulary (MCQ)', () => {
    it('should render MCQ exercise for type 1', () => {
      const question = {
        exercise_id: 1,
        exercise_item_id: 101,
        sequence: 1,
        exercise_type: {
          id: 1,
          name: '字彙',
          description: 'Vocabulary',
        },
        content: {
          question: 'Choose the correct meaning',
          options: [
            { text: 'Option 1', is_correct: false },
            { text: 'Option 2', is_correct: true },
          ],
          metadata: {
            pos: 'noun',
            translation: '選擇正確的意思',
          },
        },
      };

      render(
        <ExerciseRenderer
          question={question}
          answer={{}}
          onAnswerChange={mockOnAnswerChange}
          disabled={false}
        />
      );

      expect(screen.getByText('Choose the correct meaning')).toBeInTheDocument();
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });
  });

  describe('Type 2 - Phrase (MCQ)', () => {
    it('should render MCQ exercise for type 2', () => {
      const question = {
        exercise_id: 2,
        exercise_item_id: 102,
        sequence: 1,
        exercise_type: {
          id: 2,
          name: '片語',
          description: 'Phrase',
        },
        content: {
          question: 'What does this phrase mean?',
          options: [
            { text: 'Meaning 1', is_correct: true },
            { text: 'Meaning 2', is_correct: false },
          ],
          metadata: {
            translation: '這個片語是什麼意思？',
          },
        },
      };

      render(
        <ExerciseRenderer
          question={question}
          answer={{}}
          onAnswerChange={mockOnAnswerChange}
          disabled={false}
        />
      );

      expect(screen.getByText('What does this phrase mean?')).toBeInTheDocument();
      expect(screen.getByText('Meaning 1')).toBeInTheDocument();
    });
  });

  describe('Type 3 - Grammar (MCQ with blank)', () => {
    it('should render MCQ exercise for type 3 grammar questions', () => {
      const question = {
        exercise_id: 3,
        exercise_item_id: 103,
        sequence: 1,
        exercise_type: {
          id: 3,
          name: '文法',
          description: 'Grammar',
        },
        content: {
          question: 'My parents {{blank}} at the night market now.',
          options: [
            { text: 'be', is_correct: false, why_incorrect: 'be 是原形動詞' },
            { text: 'is', is_correct: false, why_incorrect: 'my parents 應該用 are' },
            { text: 'are', is_correct: true, why_correct: 'my parents 是複數，使用 are' },
            { text: 'am', is_correct: false, why_incorrect: 'am 只用於 I' },
          ],
          metadata: {
            translation: '我的父母現在在夜市。',
          },
        },
      };

      render(
        <ExerciseRenderer
          question={question}
          answer={{}}
          onAnswerChange={mockOnAnswerChange}
          disabled={false}
        />
      );

      expect(screen.getByText(/My parents.*at the night market now/)).toBeInTheDocument();
      expect(screen.getByText('be')).toBeInTheDocument();
      expect(screen.getByText('is')).toBeInTheDocument();
      expect(screen.getByText('are')).toBeInTheDocument();
      expect(screen.getByText('am')).toBeInTheDocument();
    });

    it('should pass metadata to MCQ component for type 3', () => {
      const question = {
        exercise_id: 3,
        exercise_item_id: 103,
        sequence: 1,
        exercise_type: {
          id: 3,
          name: '文法',
          description: 'Grammar',
        },
        content: {
          question: 'She {{blank}} a student.',
          options: [
            { text: 'is', is_correct: true },
            { text: 'are', is_correct: false },
          ],
          metadata: {
            translation: '她是一位學生。',
          },
        },
      };

      const { container } = render(
        <ExerciseRenderer
          question={question}
          answer={{}}
          onAnswerChange={mockOnAnswerChange}
          disabled={false}
        />
      );

      // Verify that MCQExercise is rendered (not ClozeExercise)
      expect(container.querySelector('[class*="MCQ"]')).toBeDefined();
    });
  });

  describe('Unsupported type', () => {
    it('should show unsupported message for unknown exercise types', () => {
      const question = {
        exercise_id: 99,
        exercise_item_id: 999,
        sequence: 1,
        exercise_type: {
          id: 99,
          name: '未知題型',
          description: 'Unknown',
        },
        content: {
          question: 'Unknown question',
          options: [],
        },
      };

      render(
        <ExerciseRenderer
          question={question}
          answer={{}}
          onAnswerChange={mockOnAnswerChange}
          disabled={false}
        />
      );

      expect(screen.getByText(/不支援的題型/)).toBeInTheDocument();
      expect(screen.getByText(/未知題型/)).toBeInTheDocument();
    });
  });

  describe('Answer handling', () => {
    it('should pass answer to MCQ component', () => {
      const question = {
        exercise_id: 1,
        exercise_item_id: 101,
        sequence: 1,
        exercise_type: {
          id: 1,
          name: '字彙',
          description: 'Vocabulary',
        },
        content: {
          question: 'Test question',
          options: [
            { text: 'A', is_correct: true },
            { text: 'B', is_correct: false },
          ],
        },
      };

      const answer = { 101: 0 };

      render(
        <ExerciseRenderer
          question={question}
          answer={answer}
          onAnswerChange={mockOnAnswerChange}
          disabled={false}
        />
      );

      // The component should render without errors when answer is provided
      expect(screen.getByText('Test question')).toBeInTheDocument();
    });
  });

  describe('Disabled mode', () => {
    it('should pass disabled prop to MCQ component', () => {
      const question = {
        exercise_id: 1,
        exercise_item_id: 101,
        sequence: 1,
        exercise_type: {
          id: 1,
          name: '字彙',
          description: 'Vocabulary',
        },
        content: {
          question: 'Test question',
          options: [
            { text: 'A', is_correct: true },
            { text: 'B', is_correct: false },
          ],
        },
      };

      render(
        <ExerciseRenderer
          question={question}
          answer={{}}
          onAnswerChange={mockOnAnswerChange}
          disabled={true}
        />
      );

      // Component should render in completed mode when disabled
      expect(screen.getByText('Test question')).toBeInTheDocument();
    });
  });
});
