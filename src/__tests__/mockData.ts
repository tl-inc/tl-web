/**
 * Shared mock data for tests
 * 集中管理測試用的 mock 資料，確保型別完整性
 */

import type { User, AuthResponse } from '@/types/auth';
import type { Exercise, ExerciseType, ExerciseItem } from '@/types/exercise';
import type { ExerciseContent, ExerciseType as SessionExerciseType } from '@/types/exerciseSession';

// ============================================================================
// User Mock Data
// ============================================================================

export const mockUser: User = {
  id: 1,
  email: 'test@example.com',
  username: 'testuser',
  full_name: 'Test User',
  role: 'student',
  is_active: true,
  is_verified: true,
  locale: 'zh_TW',
  timezone: 'Asia/Taipei',
  created_at: '2024-01-01T00:00:00Z',
};

export const mockTeacher: User = {
  id: 2,
  email: 'teacher@example.com',
  username: 'teacheruser',
  full_name: 'Teacher User',
  role: 'teacher',
  is_active: true,
  is_verified: true,
  locale: 'zh_TW',
  timezone: 'Asia/Taipei',
  created_at: '2024-01-01T00:00:00Z',
};

// ============================================================================
// Auth Mock Data
// ============================================================================

export const mockAuthResponse: AuthResponse = {
  user: mockUser,
  access_token: 'mock_access_token',
  refresh_token: 'mock_refresh_token',
  token_type: 'Bearer',
  expires_in: 3600,
  is_new_user: false,
};

// ============================================================================
// Exercise Type Mock Data
// ============================================================================

export const mockExerciseType: ExerciseType = {
  id: 1,
  name: 'vocabulary',
};

export const mockClozeExerciseType: ExerciseType = {
  id: 4,
  name: 'cloze',
};

// ============================================================================
// Exercise Mock Data
// ============================================================================

export const mockExerciseItem: ExerciseItem = {
  id: 1,
  exercise_id: 1,
  sequence: 1,
  question: 'What is the correct answer?',
  options: [
    { text: 'Option A', is_correct: true, why_correct: 'This is correct' },
    { text: 'Option B', is_correct: false, why_incorrect: 'This is incorrect' },
    { text: 'Option C', is_correct: false, why_incorrect: 'This is also incorrect' },
  ],
};

export const mockExercise: Exercise = {
  id: 1,
  subject_id: 1,
  exercise_type_id: 1,
  exercise_type: mockExerciseType,
  difficulty_bundle_id: 1,
  passage: null,
  audio_url: null,
  image_url: null,
  asset_json: null,
  exercise_items: [mockExerciseItem],
  created_at: '2024-01-01T00:00:00Z',
};

export const mockClozeExercise: Exercise = {
  id: 2,
  subject_id: 1,
  exercise_type_id: 4,
  exercise_type: mockClozeExerciseType,
  difficulty_bundle_id: 1,
  passage: 'This is a ____ passage with ____ blanks.',
  audio_url: null,
  image_url: null,
  asset_json: null,
  exercise_items: [
    {
      id: 2,
      exercise_id: 2,
      sequence: 1,
      question: null,
      options: [
        { text: 'sample', is_correct: true },
        { text: 'test', is_correct: false },
      ],
    },
    {
      id: 3,
      exercise_id: 2,
      sequence: 2,
      question: null,
      options: [
        { text: 'multiple', is_correct: true },
        { text: 'single', is_correct: false },
      ],
    },
  ],
  created_at: '2024-01-01T00:00:00Z',
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * 建立自訂的 User mock
 */
export const createMockUser = (overrides: Partial<User> = {}): User => ({
  ...mockUser,
  ...overrides,
});

/**
 * 建立自訂的 AuthResponse mock
 */
export const createMockAuthResponse = (
  overrides: Partial<AuthResponse> = {}
): AuthResponse => ({
  ...mockAuthResponse,
  ...overrides,
});

/**
 * 建立自訂的 Exercise mock
 */
export const createMockExercise = (
  overrides: Partial<Exercise> = {}
): Exercise => ({
  ...mockExercise,
  ...overrides,
});

// ============================================================================
// Exercise Session Mock Data
// ============================================================================

export const mockSessionExerciseType: SessionExerciseType = {
  id: 1,
  name: 'vocabulary',
  display_name: '單字題',
};

export const mockExerciseContent: ExerciseContent = {
  exercise_id: 1,
  exercise_item_id: 1,
  sequence: 1,
  exercise_type: mockSessionExerciseType,
  content: {
    question: 'What is the meaning of "apple"?',
    options: [
      { text: '蘋果', is_correct: true },
      { text: '香蕉', is_correct: false },
      { text: '橘子', is_correct: false },
    ],
    metadata: {
      translation: '「apple」的意思是什麼？',
    },
  },
};

/**
 * 建立自訂的 ExerciseContent mock
 */
export const createMockExerciseContent = (
  overrides: Partial<ExerciseContent> = {}
): ExerciseContent => ({
  ...mockExerciseContent,
  ...overrides,
});
