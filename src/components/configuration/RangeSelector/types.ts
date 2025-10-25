/**
 * RangeSelector Component Types
 * 範圍選擇器組件類型定義
 */

/**
 * 範圍選擇器的值
 */
export interface RangeSelectorValue {
  grade: number | null;
  semester: number | null; // 新增學期欄位
  subjectId: number | null;
  publisherEditionId: number | null; // 出版社版本 ID
  rangePackIds: number[]; // 改為陣列，支援多選 (1-10個)
}

/**
 * RangeSelector 組件屬性
 */
export interface RangeSelectorProps {
  /**
   * 當前選擇的值（受控組件）
   */
  value: RangeSelectorValue;

  /**
   * 當值改變時的回調函數
   */
  onChange: (value: RangeSelectorValue) => void;

  /**
   * 是否顯示必填標記 (*)
   * @default false
   */
  required?: boolean;

  /**
   * 是否禁用整個組件
   * @default false
   */
  disabled?: boolean;

  /**
   * 自定義 className
   */
  className?: string;
}

/**
 * 科目選項
 */
export interface SubjectOption {
  id: number;
  name: string;
}

/**
 * 科目列表響應
 */
export interface SubjectsResponse {
  subjects: SubjectOption[];
}

/**
 * 範圍包選項
 */
export interface RangePackOption {
  id: number;
  name: string;
  subject_id: number;
  grade: number | null;
  semester: number | null;
  display_order: number;
  description: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * 範圍包列表響應
 */
export interface RangePacksResponse {
  data: RangePackOption[];
  total: number;
}

/**
 * 年級學期選項
 */
export interface GradeSemesterOption {
  grade: number;
  semester: number;
  label: string;
}

/**
 * 出版社版本選項
 */
export interface PublisherEditionOption {
  id: number;
  publisher_id: number;
  publisher_name: string;
  version: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * 出版社版本列表響應
 */
export interface PublisherEditionsResponse {
  data: PublisherEditionOption[];
  total: number;
}
