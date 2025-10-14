/**
 * Range Pack Type Definitions
 */

export interface RangePack {
  id: number;
  subject_id: number;
  name: string;
  description: string | null;
  grade: number | null;       // 7, 8, 9
  semester: number | null;    // 1, 2
  exam_index: number | null;  // 1, 2, 3
  created_at: string;
  updated_at: string;
}

export interface RangePackListResponse {
  data: RangePack[];
  total: number;
}

export interface Subject {
  id: number;
  name: string;
}

export interface AvailableSubjectsResponse {
  subjects: Subject[];
}
