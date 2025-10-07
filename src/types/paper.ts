// Paper and item type definitions

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
  item_type: string;
  difficulty_bundle_id: string;
  content_json: ItemContent;
}

export interface PaperItemSet {
  sequence: number;
  item_set_id: number;
  item_set_type: string;
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
