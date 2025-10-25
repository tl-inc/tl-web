/**
 * Exercise Session 型別定義
 *
 * 對應後端 API schemas (tl-public-api/app/schemas/exercise_session.py)
 */

// ==================== 基礎型別 ====================

export type SessionStatus = 'in_progress' | 'completed' | 'abandoned';

export interface ExerciseType {
  id: number;
  name: string;
  display_name: string;
}

// ==================== Request 型別 ====================

export interface CreateSessionRequest {
  subject_id: number;
  range_pack_ids: number[];
  exercise_type_ids: number[]; // 1=字彙, 2=片語, 3=文法
}

export interface SubmitAnswerRequest {
  exercise_id: number;
  exercise_item_id?: number;
  answer_content: Record<string, unknown>; // 格式依題型而定
  time_spent: number; // 秒
}

// ==================== Response 型別 ====================

export interface SkillInfo {
  skill_id: number;
  name: string;
  type: string; // lexicon/grammar/concept/phrase
  your_level: number; // 0-5
  level_display: string; // "⭐⭐⭐⭐"
  metadata?: Record<string, unknown> | null; // skill metadata
}

export interface SessionStats {
  total_questions: number;
  correct_count: number;
  accuracy: number; // 0-1
  current_streak: number;
  max_streak: number;
}

export interface ExerciseContent {
  exercise_id: number;
  exercise_item_id?: number;
  sequence: number; // 第幾題
  exercise_type: ExerciseType;
  content: Record<string, unknown>; // 題目詳細內容
}

export interface SubmitAnswerResponse {
  is_correct: boolean;
  your_answer: Record<string, unknown>;
  correct_answer: Record<string, unknown>;
  explanation?: string;
  skills: SkillInfo[];
  session_stats: SessionStats;
}

export interface CreateSessionResponse {
  session_id: number;
  status: SessionStatus;
  started_at: string; // ISO datetime
  first_question: ExerciseContent;
}

export interface ExerciseSessionDetail {
  id: number;
  user_id: number;
  subject_id: number;
  range_pack_ids?: number[];
  status: SessionStatus;
  configuration: {
    exercise_type_ids: number[];
  };
  total_questions: number;
  correct_count: number;
  max_streak: number;
  total_time_spent: number; // 秒
  started_at: string;
  completed_at?: string;
}

export interface SkillPerformance {
  skill_id: number;
  skill_name: string;
  total: number;
  correct: number;
  accuracy: number; // 0-1
  current_level: number; // 0-5
}

export interface LevelChange {
  exercise_type_id: number;
  exercise_type_name: string;
  before: number;
  after: number;
  change: number; // after - before
}

export interface SessionSummary {
  basic_stats: SessionStats;
  skill_performance: SkillPerformance[];
  level_changes: LevelChange[];
}

export interface CompleteSessionResponse {
  session_id: number;
  status: SessionStatus;
  completed_at: string;
  summary: SessionSummary;
}
