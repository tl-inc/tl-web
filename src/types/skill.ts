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
// Grammar Skill Metadata
// ============================================================================

export interface GrammarPattern {
  formula: string;           // e.g., "主詞 + am/is/are + Ving"
  explanation: string;       // e.g., "表示現在正在進行的動作"
  visual_parts?: Array<{
    text: string;
    type: string;
  }>;
}

export interface GrammarScenario {
  content: string;
  context: string;
  translation: string;
  structured_breakdown?: Array<{
    pos: string;
    content: string;
    explanation: string;
    translation: string;
  }>;
}

export interface GrammarComparison {
  grammar_name: string;
  difference: string;
  example_pair: {
    this_grammar: GrammarScenario;
    that_grammar: GrammarScenario;
  };
}

export interface GrammarMetadata {
  category?: string;         // e.g., "tense", "voice", "mood"
  level?: string;           // e.g., "beginner", "intermediate", "advanced", "basic"
  pattern?: GrammarPattern;
  usage?: {
    when_to_use?: string[];
    scenarios?: GrammarScenario[];
  };
  exam_tips?: {
    comparisons?: GrammarComparison[];
  };
  [key: string]: unknown;   // Allow for future extensions
}

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
