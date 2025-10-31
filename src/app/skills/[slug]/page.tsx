'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AlertCircle, BookOpen, Info, ChevronDown, Check, MessageSquare, Lightbulb } from 'lucide-react';
import { skillService } from '@/lib/api/skill';
import type { Skill, GrammarMetadata } from '@/types/skill';
import { isGrammarSkill } from '@/types/skill';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">載入中...</p>
        </div>
      </div>
    );
  }

  if (error || !skill) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <CardTitle>載入失敗</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{error || '找不到此技能'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">{skill.name}</h1>
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
                    ? 'bg-green-100 text-green-800'
                    : skill.metadata.level === 'intermediate'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
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
                    <Info className="h-5 w-5 text-blue-600" />
                    文法結構
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">公式</h3>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-lg font-mono text-blue-900">
                        {skill.metadata.pattern.formula}
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">說明</h3>
                    <p className="text-gray-700 leading-relaxed">
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
                    <Check className="h-5 w-5 text-green-600" />
                    何時使用
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {skill.metadata.usage.when_to_use.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">•</span>
                        <span className="text-gray-700 flex-1">{item}</span>
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
                    <MessageSquare className="h-5 w-5 text-purple-600" />
                    使用情境範例
                  </CardTitle>
                  <CardDescription>點擊查看詳細說明</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {skill.metadata.usage.scenarios.slice(0, 3).map((scenario, index) => (
                    <Collapsible key={index}>
                      <CollapsibleTrigger className="w-full">
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 hover:bg-purple-100 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="text-left flex-1">
                              <p className="font-medium text-gray-900">{scenario.content}</p>
                              <p className="text-sm text-gray-600 mt-1">{scenario.translation}</p>
                            </div>
                            <ChevronDown className="h-5 w-5 text-gray-400 ml-4 flex-shrink-0" />
                          </div>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="mt-2 p-4 bg-gray-50 rounded-lg border">
                          <p className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">情境：</span>
                            {scenario.context}
                          </p>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Exam Tips Section */}
            {skill.metadata?.exam_tips?.comparisons && skill.metadata.exam_tips.comparisons.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-600" />
                    考試重點：文法對比
                  </CardTitle>
                  <CardDescription>理解差異，避免混淆</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {skill.metadata.exam_tips.comparisons.map((comparison, index) => (
                    <Collapsible key={index}>
                      <CollapsibleTrigger className="w-full">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 hover:bg-yellow-100 transition-colors">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900 text-left">
                              {comparison.grammar_name}
                            </h4>
                            <ChevronDown className="h-5 w-5 text-gray-400 ml-4 flex-shrink-0" />
                          </div>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="mt-2 p-4 bg-gray-50 rounded-lg border space-y-4">
                          <p className="text-sm text-gray-700">{comparison.difference}</p>
                          <Separator />
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <h5 className="text-sm font-medium text-gray-900">本文法</h5>
                              <div className="bg-blue-50 p-3 rounded border border-blue-200">
                                <p className="text-sm font-medium text-blue-900">
                                  {comparison.example_pair.this_grammar.content}
                                </p>
                                <p className="text-xs text-gray-600 mt-1">
                                  {comparison.example_pair.this_grammar.translation}
                                </p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <h5 className="text-sm font-medium text-gray-900">對比文法</h5>
                              <div className="bg-orange-50 p-3 rounded border border-orange-200">
                                <p className="text-sm font-medium text-orange-900">
                                  {comparison.example_pair.that_grammar.content}
                                </p>
                                <p className="text-xs text-gray-600 mt-1">
                                  {comparison.example_pair.that_grammar.translation}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
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
