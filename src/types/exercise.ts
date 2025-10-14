/**
 * Exercise Type Definitions (Schema V2)
 *
 * Schema V2 統一了 Items 和 ItemSets 為單一的 Exercise 概念:
 * - Exercise: 主表，代表一個練習單位（單題或題組）
 * - ExerciseItem: 子表，代表每個具體的選項/小題
 * - 單題: n=1, 題組: n>1
 */

// ============================================================================
// Exercise Type
// ============================================================================

export interface ExerciseType {
  id: number;
  name: string;  // e.g., "vocabulary", "cloze", "listening"
}

// ============================================================================
// Exercise Item (選項/小題)
// ============================================================================

export interface ExerciseItemOption {
  text: string;
  is_correct: boolean;
  why_correct?: string | null;
  why_incorrect?: string | null;
}

export interface ExerciseItem {
  id: number;
  exercise_id: number;
  sequence: number;  // 1-indexed
  question: string | null;  // null for cloze blanks
  options: ExerciseItemOption[];
}

// ============================================================================
// Exercise (主表)
// ============================================================================

export interface Exercise {
  id: number;
  subject_id: number;
  exercise_type_id: number;
  exercise_type: ExerciseType;
  difficulty_bundle_id: number | null;

  // Asset fields (根據題型不同而不同)
  passage: string | null;       // 克漏字段落、閱讀文章
  audio_url: string | null;      // 聽力音檔 URL
  image_url: string | null;      // 圖片理解圖片 URL
  asset_json: Record<string, any> | null;  // 彈性資產 (menu, notice, timetable, etc.)

  // Exercise items (所有選項/小題)
  exercise_items: ExerciseItem[];

  created_at: string;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ExerciseListResponse {
  data: Exercise[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
}

export interface ExerciseResponse extends Exercise {}

// ============================================================================
// Asset JSON 的具體類型 (可選，用於 type safety)
// ============================================================================

export interface MenuAsset {
  restaurant_name: string;
  categories: Array<{
    name: string;
    items: Array<{
      name: string;
      price: string;
      description?: string;
    }>;
  }>;
}

export interface NoticeAsset {
  title: string;
  content: string;
  date?: string;
  location?: string;
}

export interface TimetableAsset {
  title: string;
  date?: string;
  entries: Array<{
    time: string;
    activity: string;
    location?: string;
  }>;
}

export interface AdvertisementAsset {
  title: string;
  content: string;
  contact?: string;
  price?: string;
}

export interface DialogueAsset {
  context: string;
  speakers: Array<{
    name: string;
    lines: string[];
  }>;
}

// ============================================================================
// 題型檢查 Helper Types
// ============================================================================

// Exercise type names (從後端 exercise_types 表)
export type ExerciseTypeName =
  | 'vocabulary'           // 單字
  | 'phrase'              // 片語
  | 'grammar'             // 文法
  | 'cloze'               // 克漏字
  | 'picture'             // 圖片理解
  | 'reading'             // 閱讀理解
  | 'listening'           // 聽力
  | 'menu'                // 菜單
  | 'notice'              // 通知單
  | 'timetable'           // 時刻表
  | 'advertisement'       // 廣告
  | 'dialogue';           // 對話

// Helper function to check exercise type
export function isExerciseType(exercise: Exercise, typeName: ExerciseTypeName): boolean {
  return exercise.exercise_type.name === typeName;
}

// Helper to get asset as specific type
export function getAssetAs<T>(exercise: Exercise): T | null {
  return exercise.asset_json as T | null;
}
