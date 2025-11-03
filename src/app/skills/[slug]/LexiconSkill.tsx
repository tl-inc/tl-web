'use client';

import { BookOpen, Info, AlertCircle, Languages, Repeat } from 'lucide-react';
import type { Skill, LexiconMetadataV3 } from '@/types/skill';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface LexiconSkillProps {
  skill: Skill;
  metadata: LexiconMetadataV3;
}

/**
 * Convert inflection type to Chinese label
 */
function getInflectionLabel(type: string): string {
  const typeMap: Record<string, string> = {
    'plural': '複數',
    'past': '過去式',
    'past_participle': '過去分詞',
    'present_participle': '現在分詞',
    'third_person_singular': '第三人稱單數',
    'comparative': '比較級',
    'superlative': '最高級',
    'gerund': '動名詞',
    'infinitive': '不定詞',
  };
  return typeMap[type] || type;
}

/**
 * Lexicon Skill Display Component
 *
 * 設計原則：
 * - 適合國中生學習單字
 * - 完整的單字資訊（發音、詞性、例句、常見錯誤）
 * - 清晰的視覺層次
 */
export function LexiconSkill({ skill, metadata }: LexiconSkillProps) {
  return (
    <div className="space-y-6">
      {/* 1. Learning Summary (學習摘要) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            學習摘要
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {metadata.summary.map((point, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0">•</span>
                <span className="text-gray-700 dark:text-gray-300 flex-1">{point}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* 2. Word Info (單字基本資訊) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-green-600 dark:text-green-400" />
            基本資訊
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Word + Pronunciation */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {metadata.word}
              </span>
              <Badge variant="outline" className="text-sm">
                {metadata.pos}
              </Badge>
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              <span className="font-mono text-lg">{metadata.pronunciation}</span>
            </div>
          </div>

          {/* Definitions */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">主要意義：</h4>
            <div className="space-y-1">
              {metadata.definitions.map((def, index) => (
                <p key={index} className="text-lg text-gray-900 dark:text-gray-100 pl-4">
                  {metadata.definitions.length > 1 ? `${index + 1}. ` : ''}{def}
                </p>
              ))}
            </div>
          </div>

          {/* Countability (for nouns) */}
          {metadata.countability && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">可數性：</span>
              <Badge variant="secondary">
                {metadata.countability === 'countable' && '可數'}
                {metadata.countability === 'uncountable' && '不可數'}
                {metadata.countability === 'both' && '可數 / 不可數'}
              </Badge>
            </div>
          )}

          {/* Transitivity (for verbs) */}
          {metadata.transitivity && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">及物性：</span>
              <Badge variant="secondary">
                {metadata.transitivity === 'transitive' && '及物動詞'}
                {metadata.transitivity === 'intransitive' && '不及物動詞'}
                {metadata.transitivity === 'both' && '及物 / 不及物'}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 3. Inflections (詞形變化) */}
      {metadata.inflections && metadata.inflections.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Repeat className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              詞形變化
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {metadata.inflections.map((inflection, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {getInflectionLabel(inflection.type)}
                  </Badge>
                  <span className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                    {inflection.form}
                  </span>
                </div>
                <div className="pl-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                    {inflection.example}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {inflection.translation}
                  </p>
                </div>
                {index < (metadata.inflections?.length ?? 0) - 1 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* 4. Example Sentences (例句) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            例句
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {metadata.example_sentences.map((example, index) => (
            <div
              key={index}
              className="bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4"
            >
              <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                {example.sentence}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {example.translation}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 5. Additional Meanings (額外意義) */}
      {metadata.additional_meanings && metadata.additional_meanings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
              其他意義
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {metadata.additional_meanings.map((meaning, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="mt-1">
                    {meaning.context}
                  </Badge>
                  <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {meaning.definition}
                  </span>
                </div>
                <div className="pl-4 bg-cyan-50 dark:bg-cyan-950 border border-cyan-200 dark:border-cyan-800 rounded-lg p-3">
                  <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                    {meaning.example}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {meaning.translation}
                  </p>
                </div>
                {index < (metadata.additional_meanings?.length ?? 0) - 1 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* 6. Synonyms (同義詞) */}
      {metadata.synonyms && metadata.synonyms.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Languages className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              同義詞
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {metadata.synonyms.map((synonym, index) => (
              <div key={index} className="space-y-2">
                <span className="text-lg font-semibold text-emerald-700 dark:text-emerald-300">
                  {synonym.word}
                </span>
                <div className="pl-4 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-lg p-3">
                  <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                    {synonym.example}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {synonym.translation}
                  </p>
                </div>
                {index < (metadata.synonyms?.length ?? 0) - 1 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* 7. Antonyms (反義詞) */}
      {metadata.antonyms && metadata.antonyms.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Languages className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              反義詞
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {metadata.antonyms.map((antonym, index) => (
              <div key={index} className="space-y-2">
                <span className="text-lg font-semibold text-orange-700 dark:text-orange-300">
                  {antonym.word}
                </span>
                <div className="pl-4 bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
                  <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                    {antonym.example}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {antonym.translation}
                  </p>
                </div>
                {index < (metadata.antonyms?.length ?? 0) - 1 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* 8. Common Mistakes (常見錯誤) */}
      {metadata.common_mistakes && metadata.common_mistakes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              常見錯誤
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {metadata.common_mistakes.map((mistake, index) => (
              <div
                key={index}
                className="border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 rounded-lg p-4 space-y-3"
              >
                {/* Wrong */}
                <div className="flex items-start gap-2">
                  <span className="text-red-600 dark:text-red-400 font-bold text-lg mt-0.5 flex-shrink-0">✗</span>
                  <div className="flex-1">
                    <p className="font-mono text-gray-900 dark:text-gray-100">
                      {mistake.mistake}
                    </p>
                  </div>
                </div>

                {/* Correct */}
                <div className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400 font-bold text-lg mt-0.5 flex-shrink-0">✓</span>
                  <div className="flex-1">
                    <p className="font-mono text-gray-900 dark:text-gray-100 font-medium">
                      {mistake.correction}
                    </p>
                  </div>
                </div>

                {/* Explanation */}
                <div className="pl-6">
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {mistake.explanation}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
