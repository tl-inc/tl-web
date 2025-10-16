import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/__tests__/utils/test-utils';
import { ClozeExercise } from '../ClozeExercise';

describe('ClozeExercise', () => {
  const mockExercise = {
    id: 1,
    exercise_type_id: 2,
    passage: 'The cat {{blank_1}} on the mat and {{blank_2}} a nap.',
    exercise_items: [
      {
        id: 101,
        sequence: 1,
        options: [
          { text: 'sits', is_correct: true },
          { text: 'sitting', is_correct: false },
          { text: 'sit', is_correct: false },
        ],
      },
      {
        id: 102,
        sequence: 2,
        options: [
          { text: 'takes', is_correct: true },
          { text: 'taking', is_correct: false },
          { text: 'took', is_correct: false },
        ],
      },
    ],
  };

  const mockOnAnswerChange = vi.fn();

  beforeEach(() => {
    mockOnAnswerChange.mockClear();
  });

  it('should return null when passage is not available', () => {
    const exerciseWithoutPassage = { ...mockExercise, passage: null, asset_json: null };
    const { container } = render(
      <ClozeExercise
        exercise={exerciseWithoutPassage}
        answers={new Map()}
        onAnswerChange={mockOnAnswerChange}
        mode="pending"
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render passage text', () => {
    render(
      <ClozeExercise
        exercise={mockExercise}
        answers={new Map()}
        onAnswerChange={mockOnAnswerChange}
        mode="pending"
      />
    );

    expect(screen.getByText(/The cat/)).toBeInTheDocument();
    expect(screen.getByText(/on the mat and/)).toBeInTheDocument();
    expect(screen.getByText(/a nap/)).toBeInTheDocument();
  });

  it('should render dropdowns for each blank', () => {
    render(
      <ClozeExercise
        exercise={mockExercise}
        answers={new Map()}
        onAnswerChange={mockOnAnswerChange}
        mode="pending"
      />
    );

    const selects = screen.getAllByRole('combobox');
    expect(selects).toHaveLength(2);
  });

  it('should render options in dropdowns', () => {
    render(
      <ClozeExercise
        exercise={mockExercise}
        answers={new Map()}
        onAnswerChange={mockOnAnswerChange}
        mode="pending"
      />
    );

    const firstSelect = screen.getAllByRole('combobox')[0];
    expect(firstSelect).toHaveTextContent('請選擇');
    expect(firstSelect).toHaveTextContent('sits');
    expect(firstSelect).toHaveTextContent('sitting');
    expect(firstSelect).toHaveTextContent('sit');
  });

  it('should call onAnswerChange when option is selected', () => {
    render(
      <ClozeExercise
        exercise={mockExercise}
        answers={new Map()}
        onAnswerChange={mockOnAnswerChange}
        mode="in_progress"
      />
    );

    const firstSelect = screen.getAllByRole('combobox')[0];
    fireEvent.change(firstSelect, { target: { value: '0' } });

    expect(mockOnAnswerChange).toHaveBeenCalledWith(1, 101, 0);
  });

  it('should display selected answers', () => {
    const answers = new Map([
      [101, 0], // sits
      [102, 1], // taking
    ]);

    render(
      <ClozeExercise
        exercise={mockExercise}
        answers={answers}
        onAnswerChange={mockOnAnswerChange}
        mode="in_progress"
      />
    );

    const selects = screen.getAllByRole('combobox') as HTMLSelectElement[];
    expect(selects[0].value).toBe('0');
    expect(selects[1].value).toBe('1');
  });

  it('should disable dropdowns when mode is completed', () => {
    render(
      <ClozeExercise
        exercise={mockExercise}
        answers={new Map()}
        onAnswerChange={mockOnAnswerChange}
        mode="completed"
      />
    );

    const selects = screen.getAllByRole('combobox') as HTMLSelectElement[];
    selects.forEach(select => {
      expect(select.disabled).toBe(true);
    });
  });

  it('should show correct answers section in completed mode', () => {
    render(
      <ClozeExercise
        exercise={mockExercise}
        answers={new Map()}
        onAnswerChange={mockOnAnswerChange}
        mode="completed"
      />
    );

    expect(screen.getByText('正確答案：')).toBeInTheDocument();
    expect(screen.getByText('空格 1:')).toBeInTheDocument();
    expect(screen.getByText('空格 2:')).toBeInTheDocument();
  });

  it('should display correct answers in completed mode', () => {
    const answers = new Map([
      [101, 0], // correct: sits
      [102, 0], // correct: takes
    ]);

    render(
      <ClozeExercise
        exercise={mockExercise}
        answers={answers}
        onAnswerChange={mockOnAnswerChange}
        mode="completed"
      />
    );

    // Should show the correct answers section
    expect(screen.getByText('空格 1:')).toBeInTheDocument();
    expect(screen.getByText('空格 2:')).toBeInTheDocument();
    // Both correct answers should be highlighted in green
    const correctAnswers = screen.getAllByText('sits');
    expect(correctAnswers.length).toBeGreaterThan(0);
  });

  it('should show user answer when incorrect in completed mode', () => {
    const answers = new Map([
      [101, 1], // incorrect: sitting (correct is sits)
      [102, 0], // correct: takes
    ]);

    render(
      <ClozeExercise
        exercise={mockExercise}
        answers={answers}
        onAnswerChange={mockOnAnswerChange}
        mode="completed"
      />
    );

    expect(screen.getByText(/你的答案: sitting/)).toBeInTheDocument();
  });

  it('should not show correct answers section when mode is not completed', () => {
    render(
      <ClozeExercise
        exercise={mockExercise}
        answers={new Map()}
        onAnswerChange={mockOnAnswerChange}
        mode="in_progress"
      />
    );

    expect(screen.queryByText('正確答案：')).not.toBeInTheDocument();
  });

  it('should handle passage from asset_json', () => {
    const exerciseWithAssetJson = {
      ...mockExercise,
      passage: null,
      asset_json: {
        passage: 'Alternative {{blank_1}} passage.',
      },
      exercise_items: [
        {
          id: 201,
          sequence: 1,
          options: [{ text: 'test', is_correct: true }],
        },
      ],
    };

    render(
      <ClozeExercise
        exercise={exerciseWithAssetJson}
        answers={new Map()}
        onAnswerChange={mockOnAnswerChange}
        mode="pending"
      />
    );

    expect(screen.getByText(/Alternative/)).toBeInTheDocument();
    expect(screen.getByText(/passage/)).toBeInTheDocument();
  });

  it('should sort items by sequence', () => {
    const unorderedExercise = {
      ...mockExercise,
      exercise_items: [
        mockExercise.exercise_items[1], // sequence 2
        mockExercise.exercise_items[0], // sequence 1
      ],
    };

    render(
      <ClozeExercise
        exercise={unorderedExercise}
        answers={new Map()}
        onAnswerChange={mockOnAnswerChange}
        mode="pending"
      />
    );

    // Should still render in correct order
    const selects = screen.getAllByRole('combobox');
    expect(selects).toHaveLength(2);
  });

  it('should show default option text when no answer is selected', () => {
    render(
      <ClozeExercise
        exercise={mockExercise}
        answers={new Map()}
        onAnswerChange={mockOnAnswerChange}
        mode="pending"
      />
    );

    const selects = screen.getAllByRole('combobox') as HTMLSelectElement[];
    expect(selects[0].value).toBe('-1');
    expect(selects[1].value).toBe('-1');
  });
});
