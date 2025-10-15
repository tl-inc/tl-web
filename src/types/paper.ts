// Paper and item type definitions

// Import type definitions from api.ts
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

export interface McqContent {
  stem: string;
  options: string[];
  answer_index: number;
  explanation: string;
  explanations?: {
    why_correct: string;
    why_incorrect: string[];
  };
}

export interface ClozeAnswer {
  blank_number: number;
  answer_index: number;
  explanation: string;
}

export interface ClozeContent {
  passage: string;
  options: string[];
  answers: ClozeAnswer[];
}

export interface ImageAsset {
  url: string;
  prompt: string;
  description: string;
}

export interface AudioAsset {
  url: string;
  text: string;
  topic: string;
  word_count: number;
}

export interface ReadingAsset {
  title: string;
  author?: string;
  passage: string;
  word_count: number;
  genre?: string;
}

export interface MenuCategory {
  name: string;
  items: Array<{
    name: string;
    price: string;
    description?: string;
  }>;
}

export interface MenuAsset {
  restaurant_name: string;
  categories: MenuCategory[];
}

export interface NoticeAsset {
  title: string;
  content: string;
  date?: string;
  location?: string;
}

export interface ScheduleEntry {
  time: string;
  activity: string;
  location?: string;
}

export interface ScheduleAsset {
  title: string;
  date?: string;
  entries: ScheduleEntry[];
}

export type ItemContent = McqContent | ClozeContent;
export type AssetContent = ImageAsset | AudioAsset | ReadingAsset | MenuAsset | NoticeAsset | ScheduleAsset;

export interface SubItem {
  id: number;
  sequence: number;
  content_json: McqContent;
  answer: string;
}

export interface PaperItem {
  sequence: number;
  item_id: number;
  item_type: ItemType;
  difficulty_bundle_id: string;
  content_json: ItemContent;
}

export interface PaperItemSet {
  sequence: number;
  item_set_id: number;
  item_set_type: ItemSetType;
  difficulty_bundle_id: string;
  asset_json: AssetContent;
  items?: SubItem[];
}

export interface PaperData {
  id: number;
  subject_id: string;
  name: string;
  range_pack_id: string;
  created_at: string;
  updated_at: string;
  items: PaperItem[];
  item_sets: PaperItemSet[];
}

// User Paper API types
export type UserPaperStatus = 'pending' | 'in_progress' | 'completed' | 'abandoned';

export interface UserPaperResponse {
  id: string;
  user_id: number;
  paper_id: number;
  range_pack_id: string;
  status: UserPaperStatus;
  score: number | null;
  max_score: number | null;
  started_at: string | null;
  completed_at: string | null;
  time_spent: number | null;
  created_at: string;
  updated_at: string;
}

export interface StartPaperRequest {
  range_pack_id: number;
  subject_id: number;
  blueprint_id?: number;
}

export interface StartPaperResponse {
  user_paper_id: string;
  paper_id: number;
  started_at: string | null;
}
