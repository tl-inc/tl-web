/**
 * SkillFeedbackCard Component
 *
 * 顯示技能反饋資訊，包括詞性、意思、例句等
 */

import type { SkillInfo } from '@/types/exerciseSession';

interface SkillMetadata {
  pos?: string;
  meaning?: string;
  countability?: string;
  inflections?: Record<string, unknown>;
  example_sentences?: Array<{ content: string; translation: string }>;
}

interface SkillFeedbackCardProps {
  skills: SkillInfo[];
}

// 詞性映射表
const POS_MAP: Record<string, string> = {
  noun: '名詞',
  verb: '動詞',
  adjective: '形容詞',
  adverb: '副詞',
  pronoun: '代名詞',
  preposition: '介系詞',
  conjunction: '連接詞',
  auxiliary: '助動詞',
  int: '感嘆詞',
};

// 詞形變化標籤映射表
const INFLECTION_LABELS: Record<string, string> = {
  plural: '複數',
  past_tense: '過去式',
  past_participle: '過去分詞',
  present_participle: '現在分詞',
  third_person_singular: '第三人稱單數',
  comparative: '比較級',
  superlative: '最高級',
};

export function SkillFeedbackCard({ skills }: SkillFeedbackCardProps) {
  if (!skills || skills.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {skills.map((skill) => (
        <div
          key={skill.skill_id}
          className="p-4 rounded-lg border bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800"
        >
          {/* Skill 名稱 */}
          <div className="mb-3">
            <span className="font-bold text-lg text-gray-900 dark:text-gray-100">
              {skill.name}
            </span>
          </div>

          {/* Metadata 內容 */}
          {skill.metadata && (
            <SkillMetadataDetails metadata={skill.metadata as SkillMetadata} />
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * Skill Metadata Details Component
 */
function SkillMetadataDetails({ metadata }: { metadata: SkillMetadata }) {
  return (
    <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
      {/* 詞性 (POS) */}
      {metadata.pos && (
        <div>
          <span className="font-semibold">詞性：</span>
          <span>{POS_MAP[metadata.pos] || metadata.pos}</span>
        </div>
      )}

      {/* 意思 (Meaning) */}
      {metadata.meaning && (
        <div>
          <span className="font-semibold">意思：</span>
          <span>{metadata.meaning}</span>
        </div>
      )}

      {/* 可數性 (Countability) */}
      {metadata.countability && (
        <div>
          <span className="font-semibold">可數性：</span>
          <span>{metadata.countability}</span>
        </div>
      )}

      {/* 詞形變化 (Inflections) */}
      {metadata.inflections && (
        <InflectionsDisplay inflections={metadata.inflections} />
      )}

      {/* 例句 (Example Sentences) */}
      {metadata.example_sentences && metadata.example_sentences.length > 0 && (
        <ExampleSentences sentences={metadata.example_sentences} />
      )}
    </div>
  );
}

/**
 * Inflections Display Component
 */
function InflectionsDisplay({ inflections }: { inflections: Record<string, unknown> }) {
  const entries = Object.entries(inflections).filter(([, value]) => value);

  if (entries.length === 0) {
    return null;
  }

  return (
    <div>
      <span className="font-semibold">詞形變化：</span>
      <div className="ml-4 mt-1 space-y-0.5 text-xs">
        {entries.map(([form, value]) => (
          <div key={form}>
            <span className="text-gray-600 dark:text-gray-400">
              {INFLECTION_LABELS[form] || form}：
            </span>
            <span className="ml-1">{String(value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Example Sentences Component
 */
function ExampleSentences({
  sentences,
}: {
  sentences: Array<{ content: string; translation: string }>;
}) {
  return (
    <div>
      <span className="font-semibold">例句：</span>
      <div className="ml-4 mt-1 space-y-2">
        {sentences.map((example, idx) => (
          <div key={idx} className="text-xs">
            <div className="italic text-gray-800 dark:text-gray-200">
              {example.content}
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              {example.translation}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
