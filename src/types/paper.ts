// Paper type definitions (V3 Schema)

// Exercise Type (V3)
export interface ExerciseType {
  id: number;
  name: string;
  subject_id?: number;
  description?: string;
}

// Exercise Item Option
export interface ExerciseItemOption {
  text: string;
  is_correct: boolean;
  why_correct?: string | null;
  why_incorrect?: string | null;
}

// Exercise Item (子題)
export interface ExerciseItem {
  id: number;
  exercise_id: number;
  sequence: number;
  question: string | null;
  options: ExerciseItemOption[];
  metadata?: {
    translation?: string;
  } | null;
}

// Exercise (練習 / 題目)
export interface Exercise {
  id: number;
  exercise_type_id: number;
  subject_id: number;
  difficulty_bundle_id: number;
  passage: string | null;
  audio_url: string | null;
  image_url: string | null;
  asset_json: AssetJsonData | null;
  exercise_type: ExerciseType;
  exercise_items: ExerciseItem[];
  created_at: string;
}

// Paper (試卷)
export interface PaperData {
  id: number;
  range_pack_id: number;
  blueprint_id: number;
  total_items: number;
  exercises: Exercise[];
  created_at: string;
}

// User Paper API types
export type UserPaperStatus = 'pending' | 'in_progress' | 'completed' | 'abandoned';

export interface UserPaperResponse {
  id: number;
  user_id: number;
  paper_id: number;
  status: UserPaperStatus;
  started_at: string | null;
  finished_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface StartPaperRequest {
  range_pack_id: number;
  subject_id: number;
  blueprint_id?: number;
}

export interface StartPaperResponse {
  user_paper_id: number;
  paper_id: number;
  exercise_ids: number[];
  total_items: number;
  started_at: string | null;
}

// Asset types for different exercise types
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

// Menu Asset types
export interface MenuItemContent {
  content?: string;
  translation?: string;
}

export interface MenuItem {
  name: string | MenuItemContent;
  price?: string | MenuItemContent;
  description?: string | MenuItemContent;
  items?: MenuItem[];
}

export interface MenuData {
  beverages?: MenuItem[];
  appetizers?: MenuItem[];
  main_courses?: MenuItem[];
  desserts?: MenuItem[];
  set_meals?: MenuItem[];
  promotions?: MenuItem[];
}

export interface MenuAssetData {
  restaurant_name: string | MenuItemContent;
  menu: MenuData;
}

// Notice Asset types
export interface NoticeAssetData {
  title: string | MenuItemContent;
  content: string | MenuItemContent;
  date?: string | MenuItemContent;
  location?: string | MenuItemContent;
  organizer?: string | MenuItemContent;
}

// Dialogue Asset types
export interface DialogueTurn {
  speaker: string | MenuItemContent;
  text: string | MenuItemContent;
}

export interface DialogueAssetData {
  title?: string | MenuItemContent;
  setting?: string | MenuItemContent;
  turns: DialogueTurn[];
}

// Advertisement Asset types
export interface AdvertisementAssetData {
  title: string | MenuItemContent;
  company?: string | MenuItemContent;
  content: string | MenuItemContent;
  contact?: string | MenuItemContent;
}

// Timetable Asset types
export interface TimetableStop {
  station: string | MenuItemContent;
  arrival?: string;
  departure?: string;
}

export interface TimetableTrip {
  train_number: string;
  departure_time: string;
  arrival_time: string;
  duration?: string;
  platform?: string;
  stops?: TimetableStop[];
}

export interface TimetableAssetData {
  title: string | MenuItemContent;
  route?: string | MenuItemContent;
  schedule: TimetableTrip[];
}

export type AssetJsonData =
  | MenuAssetData
  | NoticeAssetData
  | DialogueAssetData
  | AdvertisementAssetData
  | TimetableAssetData
  | Record<string, unknown>;  // Fallback for unknown asset types
