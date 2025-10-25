/**
 * API Response Types
 * Matching FastAPI backend schemas
 */

// Common pagination response
export interface PaginatedResponse<T> {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  items?: T[];
}

// Type definitions
export interface ItemType {
  id: number;
  subject_id: string;
  name: string;
  description?: string;
}

export interface ItemSetType {
  id: number;
  subject_id: string;
  name: string;
  description?: string;
}

// Item types
export interface Item {
  id: number;
  subject_id: string;
  item_type: ItemType;
  difficulty_bundle_id: string | null;
  content_json: Record<string, unknown>;
  hash: string;
  answer: string | null;
  created_at: string;
  updated_at: string;
  skills?: string[];
  range_packs?: string[];
}

export interface ItemListResponse extends PaginatedResponse<Item> {
  items: Item[];
}

// ItemSet types
export interface ItemSetItem {
  sequence: number;
  content_json: Record<string, unknown>;
  answer: string | null;
}

export interface ItemSet {
  id: number;
  subject_id: string;
  item_set_type: ItemSetType;
  difficulty_bundle_id: string | null;
  asset_json: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  items: ItemSetItem[];
  skills?: string[];
  range_packs?: string[];
}

export interface ItemSetListResponse extends PaginatedResponse<ItemSet> {
  item_sets: ItemSet[];
}

// RangePack types
export interface RangePack {
  id: string;
  subject_id: string;
  grade: number;
  semester: number;
  display_order: number;
  name: string | null;
  meta_data: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  skills?: string[];
  item_count?: number;
  item_set_count?: number;
}

export interface RangePackListResponse extends PaginatedResponse<RangePack> {
  range_packs: RangePack[];
}

// DifficultyBundle types
export interface ItemDifficultyBundle {
  id: string;
  subject_id: string;
  item_type: ItemType;
  level: number;
  name: string | null;
  params: Record<string, unknown>;
  min_skill_count: number | null;
  max_skill_count: number | null;
  created_at: string;
  updated_at: string;
}

export interface ItemDifficultyBundleListResponse extends PaginatedResponse<ItemDifficultyBundle> {
  bundles: ItemDifficultyBundle[];
}

export interface ItemSetDifficultyBundle {
  id: string;
  subject_id: string;
  item_set_type: ItemSetType;
  level: number;
  name: string | null;
  params: Record<string, unknown>;
  min_skill_count: number | null;
  max_skill_count: number | null;
  created_at: string;
  updated_at: string;
}

export interface ItemSetDifficultyBundleListResponse extends PaginatedResponse<ItemSetDifficultyBundle> {
  bundles: ItemSetDifficultyBundle[];
}

// Health check
export interface HealthResponse {
  status: string;
  timestamp: string;
}
