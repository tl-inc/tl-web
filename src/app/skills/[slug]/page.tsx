'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AlertCircle, BookOpen } from 'lucide-react';
import { skillService } from '@/lib/api/skill';
import type { Skill } from '@/types/skill';
import { isGrammarSkill, isPhraseSkill } from '@/types/skill';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GrammarSkillV3 } from './GrammarSkillV3';
import { PhraseSkill } from './PhraseSkill';

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
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="capitalize">
              {skill.type === 'grammar' && '文法'}
              {skill.type === 'lexicon' && '單字'}
              {skill.type === 'phrase' && '片語'}
              {skill.type === 'concept' && '概念'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {isGrammarSkill(skill) && skill.metadata ? (
          <GrammarSkillV3 skill={skill} v3={skill.metadata} />
        ) : isPhraseSkill(skill) && skill.metadata ? (
          <PhraseSkill skill={skill} metadata={skill.metadata} />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                {skill.type === 'lexicon' && '單字技能'}
                {skill.type === 'phrase' && '片語技能'}
                {skill.type === 'concept' && '概念技能'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                此技能類型的詳細頁面正在開發中。
              </p>
            </CardContent>
          </Card>
        )}

        {/* Metadata JSON for debugging (development only) */}
        {process.env.NODE_ENV === 'development' && skill.metadata && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-sm text-gray-500">技能元數據 (開發模式)</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto max-h-96">
                {JSON.stringify(skill.metadata, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
