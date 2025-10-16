/**
 * Analytics Types
 *
 * 題型分析相關的 TypeScript 型別定義
 */

/**
 * 題型統計資訊
 */
export interface ExerciseTypeStats {
  /** 題型 ID */
  id: number;
  /** 題型名稱 */
  name: string;
  /** 使用者在此題型的等級 (1-10) */
  level: number;
  /** 最近嘗試次數 (0-10) */
  recent_attempts: number;
  /** 最近答對率 (0.0-1.0) */
  recent_correct_rate: number;
}

/**
 * 題型分組
 */
export interface ExerciseTypeGroup {
  /** 分組 ID */
  id: number;
  /** 分組名稱 */
  name: string;
  /** 顯示順序 */
  display_order: number;
  /** 此分組內的題型列表 */
  exercise_types: ExerciseTypeStats[];
}

/**
 * API 回應: 題型分組列表
 */
export interface ExerciseTypeGroupsResponse {
  /** 所有題型分組 */
  groups: ExerciseTypeGroup[];
}

/**
 * 雷達圖資料格式 (用於 recharts)
 */
export interface RadarChartData {
  /** 軸標籤 (題型名稱) */
  subject: string;
  /** 等級數值 (1-10) */
  level: number;
  /** 最大值 (用於雷達圖範圍) */
  fullMark: number;
  /** 題型 ID (用於點擊事件) */
  id: number;
  /** 最近嘗試次數 (用於 tooltip) */
  recent_attempts: number;
  /** 最近答對率 (用於 tooltip) */
  recent_correct_rate: number;
}
