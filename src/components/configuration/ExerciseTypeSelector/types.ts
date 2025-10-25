/**
 * ExerciseTypeSelector Component Types
 * 題型選擇器組件類型定義
 */

/**
 * 題型選項
 */
export interface ExerciseTypeOption {
  id: number;
  name: string;
  display_name: string;
}

/**
 * ExerciseTypeSelector 組件屬性
 */
export interface ExerciseTypeSelectorProps {
  /**
   * 已選擇的題型 ID 陣列（受控組件）
   */
  value: number[];

  /**
   * 當選擇改變時的回調函數
   */
  onChange: (value: number[]) => void;

  /**
   * 可選的題型列表
   * @default 預設提供基礎題型（字彙、片語、文法）
   */
  options?: ExerciseTypeOption[];

  /**
   * 是否顯示必填標記 (*)
   * @default false
   */
  required?: boolean;

  /**
   * 最少選擇數量
   * @default 1
   */
  minSelection?: number;

  /**
   * 最多選擇數量
   * @default undefined (無限制)
   */
  maxSelection?: number;

  /**
   * 是否禁用整個組件
   * @default false
   */
  disabled?: boolean;

  /**
   * 自定義 className
   */
  className?: string;

  /**
   * 提示訊息
   */
  helperText?: string;
}
