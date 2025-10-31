'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AlertCircle, BookOpen, Info, Check, MessageSquare, Lightbulb } from 'lucide-react';
import { skillService } from '@/lib/api/skill';
import type { Skill, GrammarMetadata } from '@/types/skill';
import { isGrammarSkill } from '@/types/skill';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { StructuredText } from '@/components/papers/exercises/StructuredText';

// 根據 type 取得顏色樣式
function getPartColorClasses(type: string): string {
  const colorMap: Record<string, string> = {
    subject: 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100',
    verb: 'bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-purple-100',
    object: 'bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100',
    adverb: 'bg-yellow-100 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100',
    be_verb: 'bg-pink-100 text-pink-900 dark:bg-pink-900 dark:text-pink-100',
    main_verb_gerund: 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900 dark:text-indigo-100',
    other: 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100',
  };
  return colorMap[type] || colorMap.other;
}

export default function SkillPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [skill, setSkill] = useState<Skill | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSkill = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await skillService.getSkillBySlug(slug);
        setSkill(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '載入技能失敗');
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      loadSkill();
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">載入中...</p>
        </div>
      </div>
    );
  }

  if (error || !skill) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertCircle className="h-5 w-5" />
              <CardTitle>載入失敗</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400">{error || '找不到此技能'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{skill.name}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="capitalize">
              {skill.type === 'grammar' && '文法'}
              {skill.type === 'lexicon' && '單字'}
              {skill.type === 'phrase' && '片語'}
              {skill.type === 'concept' && '概念'}
            </Badge>
            {isGrammarSkill(skill) && skill.metadata?.category && (
              <Badge variant="secondary">{skill.metadata.category}</Badge>
            )}
            {isGrammarSkill(skill) && skill.metadata?.level && (
              <Badge
                variant="secondary"
                className={
                  skill.metadata.level === 'beginner'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : skill.metadata.level === 'intermediate'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }
              >
                {skill.metadata.level === 'beginner' && '初級'}
                {skill.metadata.level === 'intermediate' && '中級'}
                {skill.metadata.level === 'advanced' && '高級'}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {isGrammarSkill(skill) && (
          <>
            {/* Pattern Section */}
            {skill.metadata?.pattern && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    文法結構
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">公式</h3>
                    <div className="p-4">
                      {skill.metadata.pattern.visual_parts && skill.metadata.pattern.visual_parts.length > 0 ? (
                        <div className="flex flex-wrap gap-2 items-center text-lg">
                          {skill.metadata.pattern.visual_parts.map((part, idx) => (
                            <span key={idx} className="flex items-center gap-2">
                              <span
                                className={`px-3 py-1 rounded-md font-semibold ${getPartColorClasses(part.type)}`}
                              >
                                {part.text}
                              </span>
                              {idx < skill.metadata.pattern.visual_parts!.length - 1 && (
                                <span className="text-gray-600 dark:text-gray-400 font-semibold">+</span>
                              )}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-lg font-mono text-gray-900 dark:text-gray-100">
                          {skill.metadata.pattern.formula}
                        </p>
                      )}
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">說明</h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {skill.metadata.pattern.explanation}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* When to Use Section */}
            {skill.metadata?.usage?.when_to_use && skill.metadata.usage.when_to_use.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                    何時使用
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {skill.metadata.usage.when_to_use.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                        <span className="text-gray-700 dark:text-gray-300 flex-1">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Usage Scenarios Section */}
            {skill.metadata?.usage?.scenarios && skill.metadata.usage.scenarios.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    使用情境範例
                  </CardTitle>
                  <CardDescription>點擊單字查看詳細說明</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {skill.metadata.usage.scenarios.slice(0, 3).map((scenario, index) => (
                    <div
                      key={index}
                      className="bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-lg p-4"
                    >
                      {/* 英文例句 - 使用 StructuredText 如果有 structured_breakdown */}
                      <div className="font-medium text-gray-900 dark:text-gray-100 mb-2 text-lg leading-relaxed">
                        {scenario.structured_breakdown && scenario.structured_breakdown.length > 0 ? (
                          <StructuredText breakdown={scenario.structured_breakdown} />
                        ) : (
                          scenario.content
                        )}
                      </div>
                      {/* 中文翻譯 */}
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {scenario.translation}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Exam Tips Section */}
            {skill.metadata?.exam_tips?.comparisons && skill.metadata.exam_tips.comparisons.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    考試重點：文法對比
                  </CardTitle>
                  <CardDescription>理解差異，避免混淆</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {skill.metadata.exam_tips.comparisons.map((comparison, index) => (
                    <div key={index} className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 space-y-4">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">
                        {comparison.grammar_name}
                      </h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{comparison.difference}</p>
                      <Separator />
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100">本文法</h5>
                          <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded border border-blue-200 dark:border-blue-800">
                            <div className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                              {comparison.example_pair.this_grammar.structured_breakdown &&
                               comparison.example_pair.this_grammar.structured_breakdown.length > 0 ? (
                                <StructuredText breakdown={comparison.example_pair.this_grammar.structured_breakdown} />
                              ) : (
                                comparison.example_pair.this_grammar.content
                              )}
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {comparison.example_pair.this_grammar.translation}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100">對比文法</h5>
                          <div className="bg-orange-50 dark:bg-orange-950 p-3 rounded border border-orange-200 dark:border-orange-800">
                            <div className="text-sm font-medium text-orange-900 dark:text-orange-100 mb-1">
                              {comparison.example_pair.that_grammar.structured_breakdown &&
                               comparison.example_pair.that_grammar.structured_breakdown.length > 0 ? (
                                <StructuredText breakdown={comparison.example_pair.that_grammar.structured_breakdown} />
                              ) : (
                                comparison.example_pair.that_grammar.content
                              )}
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {comparison.example_pair.that_grammar.translation}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Metadata JSON for debugging (can be removed in production) */}
        {process.env.NODE_ENV === 'development' && skill.metadata && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-gray-500">技能元數據 (開發模式)</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto max-h-96">
                {JSON.stringify(skill.metadata, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
