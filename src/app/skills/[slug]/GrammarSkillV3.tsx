'use client';

import { useState } from 'react';
import { AlertCircle, BookOpen, Info, MessageSquare, GitCompareArrows, ChevronDown, ChevronUp } from 'lucide-react';
import type { Skill, GrammarMetadataV3 } from '@/types/skill';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

interface GrammarSkillV3Props {
  skill: Skill;
  v3: GrammarMetadataV3;
}

/**
 * V3 Grammar Skill Display Component
 *
 * 設計原則：
 * - 簡潔精練易於學習
 * - 從錯中學：學生從題目產生疑惑時引導過來
 * - 不鼓勵漫無目的瀏覽
 * - SEO 優化：summary 可用於 meta description
 */
export function GrammarSkillV3({ skill, v3 }: GrammarSkillV3Props) {
  // State for managing expanded examples for each formula
  const [expandedBasicFormulas, setExpandedBasicFormulas] = useState<Set<number>>(new Set());
  const [expandedAnswerFormulas, setExpandedAnswerFormulas] = useState<Set<number>>(new Set());

  const toggleBasicFormula = (index: number) => {
    setExpandedBasicFormulas(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const toggleAnswerFormula = (index: number) => {
    setExpandedAnswerFormulas(prev => {
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
      {/* 1. Grammar Summary (條列式) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            文法摘要
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {v3.summary.map((point, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0">•</span>
                <span className="text-gray-700 dark:text-gray-300 flex-1">{point}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* 2. Basic Formulas (基本公式) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-green-600 dark:text-green-400" />
            基本公式
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {v3.basic_formulas.map((formula, index) => (
            <div key={index} className="space-y-3">
              <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <p className="font-mono text-lg text-gray-900 dark:text-gray-100 font-semibold">
                  {formula.pattern}
                </p>
                {formula.note && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    💡 {formula.note}
                  </p>
                )}
              </div>

              {/* Examples */}
              {formula.examples.length > 0 && (
                <div className="pl-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">範例：</p>
                    {formula.examples.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleBasicFormula(index)}
                        className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        {expandedBasicFormulas.has(index) ? (
                          <>
                            <ChevronUp className="h-3 w-3 mr-1" />
                            收合
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-3 w-3 mr-1" />
                            顯示全部 ({formula.examples.length})
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                  {formula.examples.map((example, exIdx) => {
                    const isExpanded = expandedBasicFormulas.has(index);
                    if (exIdx === 0 || isExpanded) {
                      return (
                        <div
                          key={exIdx}
                          className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3"
                        >
                          <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                            {example.sentence}
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

              {index < v3.basic_formulas.length - 1 && <Separator />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 3. Answer Formulas (Optional - 只有問句文法才有) */}
      {v3.answer_formulas && v3.answer_formulas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              答句公式
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {v3.answer_formulas.map((formula, index) => (
              <div key={index} className="space-y-3">
                <div className="bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                  <p className="font-mono text-lg text-gray-900 dark:text-gray-100 font-semibold">
                    {formula.pattern}
                  </p>
                  {formula.note && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      💡 {formula.note}
                    </p>
                  )}
                </div>

                {/* Examples */}
                {formula.examples.length > 0 && (
                  <div className="pl-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">範例：</p>
                      {formula.examples.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleAnswerFormula(index)}
                          className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          {expandedAnswerFormulas.has(index) ? (
                            <>
                              <ChevronUp className="h-3 w-3 mr-1" />
                              收合
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-3 w-3 mr-1" />
                              顯示全部 ({formula.examples.length})
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                    {formula.examples.map((example, exIdx) => {
                      const isExpanded = expandedAnswerFormulas.has(index);
                      if (exIdx === 0 || isExpanded) {
                        return (
                          <div
                            key={exIdx}
                            className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3"
                          >
                            <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                              {example.sentence}
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

                {index < (v3.answer_formulas?.length ?? 0) - 1 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* 4. Common Mistakes (重要！用於出題) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            常見錯誤
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {v3.common_mistakes.map((mistake, index) => (
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

      {/* 5. Similar Grammars (Optional - 不強制) */}
      {v3.similar_grammars && v3.similar_grammars.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitCompareArrows className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              相似文法比較
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {v3.similar_grammars.map((comparison, index) => (
              <div
                key={index}
                className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4 space-y-4"
              >
                {/* Grammar Name */}
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                  vs. {comparison.grammar_name}
                </h4>

                {/* Difference Explanation */}
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {comparison.difference}
                </p>

                <Separator />

                {/* Example Comparison */}
                <div className="grid md:grid-cols-2 gap-4">
                  {/* This Grammar */}
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      本文法（{skill.name}）
                    </h5>
                    <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded p-3">
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                        {comparison.example_this.sentence}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {comparison.example_this.translation}
                      </p>
                    </div>
                  </div>

                  {/* That Grammar */}
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      對比文法（{comparison.grammar_name}）
                    </h5>
                    <div className="bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded p-3">
                      <p className="text-sm font-medium text-orange-900 dark:text-orange-100 mb-1">
                        {comparison.example_that.sentence}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {comparison.example_that.translation}
                      </p>
                    </div>
                  </div>
                </div>

                {index < (v3.similar_grammars?.length ?? 0) - 1 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* SEO 提示 (開發模式) */}
      {process.env.NODE_ENV === 'development' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-500">SEO Meta Description (開發模式)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
              此 summary 將用於 SEO meta description：
            </p>
            <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-auto">
              {v3.summary.join(' ')}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
