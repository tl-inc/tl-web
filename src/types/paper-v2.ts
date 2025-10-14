/**
 * Paper Type Definitions (Schema V2)
 *
 * Schema V2 的 Paper 結構:
 * - Paper 使用 JSON array 儲存 exercise_ids (不再使用 junction tables)
 * - UserPaper 追蹤用戶的練習狀態
 * - UserAnswer 統一追蹤所有答案 (不再區分 item/item_set)
 */

import type { Exercise } from './exercise';

// ============================================================================
// Paper
// ============================================================================

export interface Paper {
  id: number;
  range_pack_id: number;
  exercise_ids: number[];  // Ordered array of exercise IDs
  total_items: number;     // Precomputed total count of exercise_items
  created_at: string;
  updated_at: string;
}

export interface PaperDetail extends Paper {
  exercises: Exercise[];   // Full exercise details with items
}

// ============================================================================
// UserPaper (用戶練習狀態)
// ============================================================================

export type UserPaperStatus = 'pending' | 'in_progress' | 'completed' | 'abandoned';

export interface UserPaper {
  id: string;              // UUID
  user_id: number;
  paper_id: number;
  range_pack_id: number;
  status: UserPaperStatus;
  score: number | null;
  max_score: number | null;
  started_at: string | null;
  completed_at: string | null;
  time_spent: number | null;  // seconds
  created_at: string;
  updated_at: string;
}

// ============================================================================
// UserAnswer (統一的答案追蹤)
// ============================================================================

export interface UserAnswer {
  id: number;
  user_paper_id: string;
  exercise_id: number;
  exercise_item_id: number;   // Which 小題/選項
  answer_content: Record<string, any>;  // Flexible answer format
  is_correct: boolean;
  created_at: string;
}

// ============================================================================
// API Request/Response Types
// ============================================================================

// Start Paper
export interface StartPaperRequest {
  range_pack_id: number;
}

export interface StartPaperResponse {
  user_paper: UserPaper;
  paper: PaperDetail;
}

// Submit Answer
export interface SubmitAnswerRequest {
  exercise_id: number;
  exercise_item_id: number;
  answer_content: Record<string, any>;
}

export interface SubmitAnswerResponse {
  user_answer: UserAnswer;
  is_correct: boolean;
}

// Complete Paper
export interface CompletePaperResponse {
  user_paper: UserPaper;
  score: number;
  max_score: number;
  time_spent: number;
}

// Review Paper
export interface ReviewPaperResponse {
  user_paper: UserPaper;
  paper: PaperDetail;
  user_answers: UserAnswer[];
}

// ============================================================================
// Frontend State Types (for UI)
// ============================================================================

export interface PaperState {
  paper: PaperDetail | null;
  userPaper: UserPaper | null;
  currentExerciseIndex: number;
  userAnswers: Map<number, Map<number, any>>;  // exercise_id -> exercise_item_id -> answer
  loading: boolean;
  error: string | null;
}

// Helper type for answer tracking
export type ExerciseAnswers = Map<number, any>;  // exercise_item_id -> answer
