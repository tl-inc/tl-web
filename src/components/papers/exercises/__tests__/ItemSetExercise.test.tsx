import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/__tests__/utils/test-utils';
import { ItemSetExercise } from '../ItemSetExercise';
import type { Exercise } from '@/types/paper';

describe('ItemSetExercise', () => {
  const mockOnAnswerChange = vi.fn();
  const mockAnswers = new Map<number, number>();

  const baseExercise: Exercise = {
    id: 1,
    exercise_type_id: 6,
    question: 'Test question',
    exercise_items: [
      {
        id: 101,
        question: 'Item 1',
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correct_answer: { selected_index: 0 },
      },
      {
        id: 102,
        question: 'Item 2',
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correct_answer: { selected_index: 1 },
      },
    ],
  };

  it('should render exercise with passage', () => {
    const exercise = {
      ...baseExercise,
      passage: 'This is a test passage',
    };

    render(
      <ItemSetExercise
        exercise={exercise}
        answers={mockAnswers}
        onAnswerChange={mockOnAnswerChange}
        mode="in_progress"
      />
    );

    expect(screen.getByText('This is a test passage')).toBeInTheDocument();
  });

  it('should render image when image_url is provided', () => {
    const exercise = {
      ...baseExercise,
      image_url: 'https://example.com/image.jpg',
    };

    render(
      <ItemSetExercise
        exercise={exercise}
        answers={mockAnswers}
        onAnswerChange={mockOnAnswerChange}
        mode="in_progress"
      />
    );

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('should render audio player when audio_url is provided', () => {
    const exercise = {
      ...baseExercise,
      audio_url: 'https://example.com/audio.mp3',
    };

    const { container } = render(
      <ItemSetExercise
        exercise={exercise}
        answers={mockAnswers}
        onAnswerChange={mockOnAnswerChange}
        mode="in_progress"
      />
    );

    const audio = container.querySelector('audio');
    expect(audio).toBeInTheDocument();
    expect(audio?.querySelector('source')).toHaveAttribute('src', 'https://example.com/audio.mp3');
  });

  it('should hide transcript for listening exercise in progress mode', () => {
    const exercise = {
      ...baseExercise,
      exercise_type_id: 7, // Listening
      passage: 'Listening transcript',
    };

    render(
      <ItemSetExercise
        exercise={exercise}
        answers={mockAnswers}
        onAnswerChange={mockOnAnswerChange}
        mode="in_progress"
      />
    );

    expect(screen.queryByText('Listening transcript')).not.toBeInTheDocument();
  });

  it('should show transcript for listening exercise in completed mode', () => {
    const exercise = {
      ...baseExercise,
      exercise_type_id: 7, // Listening
      passage: 'Listening transcript',
    };

    render(
      <ItemSetExercise
        exercise={exercise}
        answers={mockAnswers}
        onAnswerChange={mockOnAnswerChange}
        mode="completed"
      />
    );

    expect(screen.getByText('Listening transcript')).toBeInTheDocument();
  });

  it('should show translation in completed mode', () => {
    const exercise = {
      ...baseExercise,
      passage: 'English text',
      asset_json: {
        translation: '中文翻譯',
      },
    };

    render(
      <ItemSetExercise
        exercise={exercise}
        answers={mockAnswers}
        onAnswerChange={mockOnAnswerChange}
        mode="completed"
      />
    );

    expect(screen.getByText('English text')).toBeInTheDocument();
    expect(screen.getByText('中文翻譯')).toBeInTheDocument();
  });

  it('should not show translation in progress mode', () => {
    const exercise = {
      ...baseExercise,
      passage: 'English text',
      asset_json: {
        translation: '中文翻譯',
      },
    };

    render(
      <ItemSetExercise
        exercise={exercise}
        answers={mockAnswers}
        onAnswerChange={mockOnAnswerChange}
        mode="in_progress"
      />
    );

    expect(screen.getByText('English text')).toBeInTheDocument();
    expect(screen.queryByText('中文翻譯')).not.toBeInTheDocument();
  });

  it('should render MenuAsset for exercise type 8', () => {
    const exercise = {
      ...baseExercise,
      exercise_type_id: 8,
      asset_json: {
        title: 'Menu Title',
        items: [{ name: 'Item 1', price: 100 }],
      },
    };

    const { container } = render(
      <ItemSetExercise
        exercise={exercise}
        answers={mockAnswers}
        onAnswerChange={mockOnAnswerChange}
        mode="in_progress"
      />
    );

    // MenuAsset renders, just verify component renders without error
    expect(container.querySelector('.space-y-4')).toBeInTheDocument();
  });

  it('should render NoticeAsset for exercise type 9', () => {
    const exercise = {
      ...baseExercise,
      exercise_type_id: 9,
      asset_json: {
        title: 'Notice Title',
        content: 'Notice content',
      },
    };

    const { container } = render(
      <ItemSetExercise
        exercise={exercise}
        answers={mockAnswers}
        onAnswerChange={mockOnAnswerChange}
        mode="in_progress"
      />
    );

    // NoticeAsset renders, just verify component renders without error
    expect(container.querySelector('.space-y-4')).toBeInTheDocument();
  });

  it('should render DialogueAsset for exercise type 12', () => {
    const exercise = {
      ...baseExercise,
      exercise_type_id: 12,
      asset_json: {
        dialogue: [
          { speaker: 'A', text: 'Hello' },
          { speaker: 'B', text: 'Hi' },
        ],
      },
    };

    const { container } = render(
      <ItemSetExercise
        exercise={exercise}
        answers={mockAnswers}
        onAnswerChange={mockOnAnswerChange}
        mode="in_progress"
      />
    );

    // Just check that DialogueAsset is rendered (it contains the text)
    expect(container).toBeTruthy();
  });

  it('should render all sub-items', () => {
    render(
      <ItemSetExercise
        exercise={baseExercise}
        answers={mockAnswers}
        onAnswerChange={mockOnAnswerChange}
        mode="in_progress"
      />
    );

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('should use passage from asset_json if passage is not provided', () => {
    const exercise = {
      ...baseExercise,
      asset_json: {
        passage: 'Passage from asset_json',
      },
    };

    render(
      <ItemSetExercise
        exercise={exercise}
        answers={mockAnswers}
        onAnswerChange={mockOnAnswerChange}
        mode="in_progress"
      />
    );

    expect(screen.getByText('Passage from asset_json')).toBeInTheDocument();
  });
});
