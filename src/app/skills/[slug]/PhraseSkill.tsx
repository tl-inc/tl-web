'use client';

import { useState } from 'react';
import { AlertCircle, BookOpen, Lightbulb, ChevronDown, ChevronUp, Shuffle } from 'lucide-react';
import type { Skill, PhraseMetadata } from '@/types/skill';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PhraseSkillProps {
  skill: Skill;
  metadata: PhraseMetadata;
}

/**
 * Phrase Skill Display Component
 *
 * 設計原則：
 * - 簡潔精練易於學習
 * - 從錯中學：學生從題目產生疑惑時引導過來
 * - 不鼓勵漫無目的瀏覽
 * - SEO 優化：summary 可用於 meta description
 */
export function PhraseSkill({ skill, metadata }: PhraseSkillProps) {
  // State for managing expanded examples
  const [expandedBaseForms, setExpandedBaseForms] = useState<Set<number>>(new Set());
  const [expandedVariants, setExpandedVariants] = useState<Set<number>>(new Set());

  const toggleBaseForm = (index: number) => {
    setExpandedBaseForms(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const toggleVariant = (index: number) => {
    setExpandedVariants(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Phrase Summary */}
      {metadata.summary && metadata.summary.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              片語摘要
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
      )}

      {/* 2. Forms - Base Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-green-600 dark:text-green-400" />
            形式與用法
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Base Form */}
          <div className="space-y-3">
            <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <p className="font-mono text-xl text-gray-900 dark:text-gray-100 font-semibold mb-2">
                {metadata.forms.base.form}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                💡 {metadata.forms.base.usage_note}
              </p>
            </div>

            {/* Merged Examples (for phrasal verbs) */}
            {metadata.forms.base.merged_examples && metadata.forms.base.merged_examples.length > 0 && (
              <div className="pl-4 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    合併形式範例：
                  </p>
                  {metadata.forms.base.merged_examples.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleBaseForm(0)}
                      className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {expandedBaseForms.has(0) ? (
                        <>
                          <ChevronUp className="h-3 w-3 mr-1" />
                          收合
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-3 w-3 mr-1" />
                          顯示全部 ({metadata.forms.base.merged_examples.length})
                        </>
                      )}
                    </Button>
                  )}
                </div>
                {metadata.forms.base.merged_examples.map((example, exIdx) => {
                  const isExpanded = expandedBaseForms.has(0);
                  if (exIdx === 0 || isExpanded) {
                    return (
                      <div
                        key={exIdx}
                        className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3"
                      >
                        <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                          {example.content}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {example.translation}
                        </p>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            )}

            {/* Separated Examples (for phrasal verbs) */}
            {metadata.forms.base.separated_examples && metadata.forms.base.separated_examples.length > 0 && (
              <div className="pl-4 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    分離形式範例：
                  </p>
                  {metadata.forms.base.separated_examples.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleBaseForm(1)}
                      className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {expandedBaseForms.has(1) ? (
                        <>
                          <ChevronUp className="h-3 w-3 mr-1" />
                          收合
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-3 w-3 mr-1" />
                          顯示全部 ({metadata.forms.base.separated_examples.length})
                        </>
                      )}
                    </Button>
                  )}
                </div>
                {metadata.forms.base.separated_examples.map((example, exIdx) => {
                  const isExpanded = expandedBaseForms.has(1);
                  if (exIdx === 0 || isExpanded) {
                    return (
                      <div
                        key={exIdx}
                        className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3"
                      >
                        <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                          {example.content}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {example.translation}
                        </p>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            )}

            {/* General Examples (for non-phrasal verbs) */}
            {metadata.forms.base.examples && metadata.forms.base.examples.length > 0 && (
              <div className="pl-4 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">範例：</p>
                  {metadata.forms.base.examples.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleBaseForm(2)}
                      className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {expandedBaseForms.has(2) ? (
                        <>
                          <ChevronUp className="h-3 w-3 mr-1" />
                          收合
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-3 w-3 mr-1" />
                          顯示全部 ({metadata.forms.base.examples.length})
                        </>
                      )}
                    </Button>
                  )}
                </div>
                {metadata.forms.base.examples.map((example, exIdx) => {
                  const isExpanded = expandedBaseForms.has(2);
                  if (exIdx === 0 || isExpanded) {
                    return (
                      <div
                        key={exIdx}
                        className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3"
                      >
                        <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                          {example.content}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {example.translation}
                        </p>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            )}
          </div>

          {/* Variant Forms */}
          {metadata.forms.variants && metadata.forms.variants.length > 0 && (
            <>
              <Separator />
              <div className="space-y-6">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">其他形式：</p>
                {metadata.forms.variants.map((variant, varIdx) => (
                  <div key={varIdx} className="space-y-3">
                    <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <p className="font-mono text-lg text-gray-900 dark:text-gray-100 font-semibold mb-2">
                        {variant.form}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        💡 {variant.usage_note}
                      </p>
                    </div>

                    {/* Variant Examples */}
                    {variant.examples && variant.examples.length > 0 && (
                      <div className="pl-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">範例：</p>
                          {variant.examples.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleVariant(varIdx)}
                              className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                              {expandedVariants.has(varIdx) ? (
                                <>
                                  <ChevronUp className="h-3 w-3 mr-1" />
                                  收合
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="h-3 w-3 mr-1" />
                                  顯示全部 ({variant.examples.length})
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                        {variant.examples.map((example, exIdx) => {
                          const isExpanded = expandedVariants.has(varIdx);
                          if (exIdx === 0 || isExpanded) {
                            return (
                              <div
                                key={exIdx}
                                className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3"
                              >
                                <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                                  {example.content}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {example.translation}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* 3. Common Mistakes */}
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
                      {mistake.wrong}
                    </p>
                  </div>
                </div>

                {/* Correct */}
                <div className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400 font-bold text-lg mt-0.5 flex-shrink-0">✓</span>
                  <div className="flex-1">
                    <p className="font-mono text-gray-900 dark:text-gray-100 font-medium">
                      {mistake.correct}
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

      {/* 4. Synonyms & Antonyms */}
      {metadata.synonyms_antonyms && metadata.synonyms_antonyms.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shuffle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              同義詞與反義詞
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {metadata.synonyms_antonyms.map((item, index) => (
              <div
                key={index}
                className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4 space-y-2"
              >
                <div className="flex items-center gap-3">
                  <Badge variant={item.type === 'synonym' ? 'default' : 'destructive'}>
                    {item.type === 'synonym' ? '同義' : '反義'}
                  </Badge>
                  <p className="font-mono text-lg text-gray-900 dark:text-gray-100 font-semibold">
                    {item.word}
                  </p>
                  <span className="text-gray-600 dark:text-gray-400">({item.translation})</span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed pl-2">
                  {item.difference}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* SEO 提示 (開發模式) */}
      {process.env.NODE_ENV === 'development' && metadata.summary && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-500">SEO Meta Description (開發模式)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
              此 summary 將用於 SEO meta description：
            </p>
            <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-auto">
              {metadata.summary.join(' ')}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
