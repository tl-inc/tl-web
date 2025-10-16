import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/__tests__/utils/test-utils';
import { MCQExercise } from '../MCQExercise';

describe('MCQExercise', () => {
  const mockExercise = {
    id: 1,
    exercise_type_id: 1,
    exercise_items: [
      {
        id: 101,
        question: 'What is the capital of France?',
        options: [
          { text: 'London', is_correct: false, why_incorrect: 'London is the capital of UK' },
          { text: 'Paris', is_correct: true, why_correct: 'Paris is the capital of France' },
          { text: 'Berlin', is_correct: false },
          { text: 'Madrid', is_correct: false },
        ],
        metadata: {
          translation: '法國的首都是什麼?',
        },
      },
    ],
  };

  const mockOnAnswerChange = vi.fn();

  beforeEach(() => {
    mockOnAnswerChange.mockClear();
  });

  it('should return null when exercise has no items', () => {
    const exerciseWithoutItems = { ...mockExercise, exercise_items: [] };
    const { container } = render(
      <MCQExercise
        exercise={exerciseWithoutItems}
        answers={new Map()}
        onAnswerChange={mockOnAnswerChange}
        mode="pending"
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render question text', () => {
    render(
      <MCQExercise
        exercise={mockExercise}
        answers={new Map()}
        onAnswerChange={mockOnAnswerChange}
        mode="pending"
      />
    );
    expect(screen.getByText('What is the capital of France?')).toBeInTheDocument();
  });

  it('should render all options', () => {
    render(
      <MCQExercise
        exercise={mockExercise}
        answers={new Map()}
        onAnswerChange={mockOnAnswerChange}
        mode="pending"
      />
    );
    expect(screen.getByText('London')).toBeInTheDocument();
    expect(screen.getByText('Paris')).toBeInTheDocument();
    expect(screen.getByText('Berlin')).toBeInTheDocument();
    expect(screen.getByText('Madrid')).toBeInTheDocument();
  });

  it('should call onAnswerChange when option is selected', () => {
    render(
      <MCQExercise
        exercise={mockExercise}
        answers={new Map()}
        onAnswerChange={mockOnAnswerChange}
        mode="in_progress"
      />
    );

    const parisOption = screen.getByLabelText(/Paris/);
    fireEvent.click(parisOption);

    expect(mockOnAnswerChange).toHaveBeenCalledWith(1, 101, 1);
  });

  it('should display selected answer', () => {
    const answers = new Map([[101, 1]]); // Paris is selected (index 1)
    render(
      <MCQExercise
        exercise={mockExercise}
        answers={answers}
        onAnswerChange={mockOnAnswerChange}
        mode="in_progress"
      />
    );

    const parisOption = screen.getByLabelText(/Paris/) as HTMLInputElement;
    expect(parisOption.checked).toBe(true);
  });

  it('should disable options when mode is completed', () => {
    render(
      <MCQExercise
        exercise={mockExercise}
        answers={new Map()}
        onAnswerChange={mockOnAnswerChange}
        mode="completed"
      />
    );

    const londonOption = screen.getByLabelText(/London/) as HTMLInputElement;
    expect(londonOption.disabled).toBe(true);
  });

  it('should show translation when mode is completed', () => {
    render(
      <MCQExercise
        exercise={mockExercise}
        answers={new Map()}
        onAnswerChange={mockOnAnswerChange}
        mode="completed"
      />
    );

    expect(screen.getByText('法國的首都是什麼?')).toBeInTheDocument();
  });

  it('should not show translation when mode is not completed', () => {
    render(
      <MCQExercise
        exercise={mockExercise}
        answers={new Map()}
        onAnswerChange={mockOnAnswerChange}
        mode="in_progress"
      />
    );

    expect(screen.queryByText('法國的首都是什麼?')).not.toBeInTheDocument();
  });

  it('should show unanswered badge in completed mode when no answer', () => {
    render(
      <MCQExercise
        exercise={mockExercise}
        answers={new Map()}
        onAnswerChange={mockOnAnswerChange}
        mode="completed"
      />
    );

    expect(screen.getByText('⚠️ 未作答')).toBeInTheDocument();
  });

  it('should not show unanswered badge when answer is provided', () => {
    const answers = new Map([[101, 1]]);
    render(
      <MCQExercise
        exercise={mockExercise}
        answers={answers}
        onAnswerChange={mockOnAnswerChange}
        mode="completed"
      />
    );

    expect(screen.queryByText('⚠️ 未作答')).not.toBeInTheDocument();
  });

  it('should show correct answer explanation in completed mode', () => {
    const answers = new Map([[101, 1]]); // Correct answer
    render(
      <MCQExercise
        exercise={mockExercise}
        answers={answers}
        onAnswerChange={mockOnAnswerChange}
        mode="completed"
      />
    );

    expect(screen.getByText(/Paris is the capital of France/)).toBeInTheDocument();
  });

  it('should show incorrect answer explanation in completed mode', () => {
    const answers = new Map([[101, 0]]); // London (incorrect)
    render(
      <MCQExercise
        exercise={mockExercise}
        answers={answers}
        onAnswerChange={mockOnAnswerChange}
        mode="completed"
      />
    );

    expect(screen.getByText(/London is the capital of UK/)).toBeInTheDocument();
  });

  it('should replace {{blank}} with underscores in question', () => {
    const exerciseWithBlank = {
      ...mockExercise,
      exercise_items: [
        {
          ...mockExercise.exercise_items[0],
          question: 'The capital of France is {{blank}}',
        },
      ],
    };

    render(
      <MCQExercise
        exercise={exerciseWithBlank}
        answers={new Map()}
        onAnswerChange={mockOnAnswerChange}
        mode="pending"
      />
    );

    expect(screen.getByText('The capital of France is ____')).toBeInTheDocument();
  });

  it('should handle questions without metadata', () => {
    const exerciseWithoutMetadata = {
      ...mockExercise,
      exercise_items: [
        {
          id: 101,
          question: 'Simple question',
          options: [
            { text: 'Option A', is_correct: true },
            { text: 'Option B', is_correct: false },
          ],
        },
      ],
    };

    render(
      <MCQExercise
        exercise={exerciseWithoutMetadata}
        answers={new Map()}
        onAnswerChange={mockOnAnswerChange}
        mode="completed"
      />
    );

    expect(screen.getByText('Simple question')).toBeInTheDocument();
    // No translation should appear
  });
});
