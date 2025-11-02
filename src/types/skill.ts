/**
 * Skill Type Definitions
 *
 * Skills represent learning concepts across different types:
 * - grammar: 文法技能 (e.g., 現在進行式)
 * - lexicon: 單字技能 (e.g., book)
 * - phrase: 片語技能 (e.g., take care of)
 * - concept: 概念技能 (e.g., 主詞動詞一致性)
 */

// ============================================================================
// Skill Types
// ============================================================================

export type SkillType = 'grammar' | 'lexicon' | 'phrase' | 'concept';

// ============================================================================
// Grammar Skill Metadata - V3 Simplified Schema (2025-01)
// ============================================================================

/**
 * V3 Schema Design Principles:
 * - 簡潔精練易於學習 (Simple, refined, easy to learn)
 * - 從錯中學 (Learn from mistakes) - students arrive from questions, not browsing
 * - SEO 優化 - summary can be used as meta description
 * - AI-driven example refinement - avoid redundant similar examples
 */

// Example sentence with translation
export interface GrammarExampleV3 {
  sentence: string;          // English example sentence
  translation: string;       // Chinese translation
}

// Formula pattern with examples
export interface FormulaPatternV3 {
  pattern: string;           // Formula pattern (e.g., "How often + do/does + 主詞 + 動詞原形...?")
  note?: string;             // Optional explanation note
  examples: GrammarExampleV3[];  // Example sentences (AI-refined to avoid redundancy)
}

// Common mistake entry (critical for question generation)
export interface CommonMistakeV3 {
  wrong: string;             // Incorrect usage
  correct: string;           // Correct usage
  explanation: string;       // Why it's wrong and how to fix
}

// Similar grammar comparison (optional)
export interface SimilarGrammarV3 {
  grammar_name: string;      // Name of similar grammar
  difference: string;        // Key difference explanation
  example_this: GrammarExampleV3;   // Example using current grammar
  example_that: GrammarExampleV3;   // Example using similar grammar
}

// V3 Grammar Metadata (Simplified)
export interface GrammarMetadataV3 {
  // 1. Grammar Summary (條列式，可用於顯示和 SEO meta description)
  summary: string[];         // Bulleted summary points

  // 2. Basic Formula (基本公式，AI-refined examples to avoid redundancy)
  basic_formulas: FormulaPatternV3[];

  // 3. Answer Formula (Optional - only for question-type grammar)
  answer_formulas?: FormulaPatternV3[];

  // 4. Common Mistakes (重要！用於出題，問句文法應包含答句錯誤)
  common_mistakes: CommonMistakeV3[];

  // 5. Similar Grammar Comparison (Optional - 不強制，沒有相似文法就不寫)
  similar_grammars?: SimilarGrammarV3[];
}

// V3 is the only supported schema (2025-01 Complete Rewrite)
// Note: Metadata is stored directly without v3 wrapper (as of 2025-01-02)
export type GrammarMetadata = GrammarMetadataV3;

// ============================================================================
// Lexicon Skill Metadata
// ============================================================================

export interface LexiconForm {
  form: string;
  usage_note?: string;
}

export interface LexiconMetadata {
  pos?: string;             // Part of speech: "noun", "verb", etc.
  meaning?: string;         // Chinese meaning
  forms?: {
    singular?: LexiconForm;
    plural?: LexiconForm;
    [key: string]: LexiconForm | undefined;
  };
  [key: string]: unknown;
}

// ============================================================================
// Phrase Skill Metadata
// ============================================================================

export interface PhraseForm {
  form: string;
}

export interface PhraseMetadata {
  type?: string;            // e.g., "phrasal_verb", "idiom"
  meaning?: string;         // Chinese meaning
  forms?: {
    base?: PhraseForm;
    [key: string]: PhraseForm | undefined;
  };
  [key: string]: unknown;
}

// ============================================================================
// Concept Skill Metadata
// ============================================================================

export interface ConceptMetadata {
  description?: string;     // Concept explanation
  [key: string]: unknown;
}

// ============================================================================
// Unified Skill Metadata Type
// ============================================================================

export type SkillMetadata =
  | GrammarMetadata
  | LexiconMetadata
  | PhraseMetadata
  | ConceptMetadata;

// ============================================================================
// Skill Models
// ============================================================================

export interface SkillBase {
  id: number;
  subject_id: number;
  type: SkillType;
  name: string;
  slug: string | null;
  metadata: SkillMetadata | null;
}

export interface Skill extends SkillBase {
  created_at: string;
  updated_at: string;
}

export interface SkillListItem {
  id: number;
  type: SkillType;
  name: string;
  slug: string | null;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface SkillListResponse {
  skills: SkillListItem[];
  total: number;
}

export type SkillResponse = Skill;

// ============================================================================
// Type Guards
// ============================================================================

export function isGrammarSkill(skill: Skill): skill is Skill & { metadata: GrammarMetadata } {
  return skill.type === 'grammar';
}

export function isLexiconSkill(skill: Skill): skill is Skill & { metadata: LexiconMetadata } {
  return skill.type === 'lexicon';
}

export function isPhraseSkill(skill: Skill): skill is Skill & { metadata: PhraseMetadata } {
  return skill.type === 'phrase';
}

export function isConceptSkill(skill: Skill): skill is Skill & { metadata: ConceptMetadata } {
  return skill.type === 'concept';
}
