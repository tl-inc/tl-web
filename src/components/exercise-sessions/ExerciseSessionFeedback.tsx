/**
 * ExerciseSessionFeedback 元件
 *
 * 顯示即時反饋卡片
 */
import { memo } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { SessionStats, SkillInfo } from '@/types/exerciseSession';
import { ExerciseSessionStats } from './ExerciseSessionStats';
import { SkillTag } from './SkillTag';

interface ExerciseSessionFeedbackProps {
  isCorrect: boolean;
  yourAnswer: Record<string, unknown>;
  correctAnswer: Record<string, unknown>;
  explanation?: string;
  skills: SkillInfo[];
  sessionStats: SessionStats;
  onNext: () => void;
  onComplete: () => void;
  className?: string;
}

export const ExerciseSessionFeedback = memo(
  function ExerciseSessionFeedback({
    isCorrect,
    yourAnswer,
    correctAnswer,
    explanation,
    skills,
    sessionStats,
    onNext,
    onComplete,
    className,
  }: ExerciseSessionFeedbackProps) {
    return (
      <Card className={cn('w-full', className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isCorrect ? (
              <>
                <CheckCircle className="h-6 w-6 text-green-500" />
                <span className="text-green-600">答對了!</span>
              </>
            ) : (
              <>
                <XCircle className="h-6 w-6 text-red-500" />
                <span className="text-red-600">答錯了</span>
              </>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* 答案對比 */}
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-sm font-medium text-muted-foreground min-w-20">
                你的答案:
              </span>
              <span className={cn('text-sm', isCorrect ? 'text-green-600' : 'text-red-600')}>
                {JSON.stringify(yourAnswer)}
              </span>
            </div>
            {!isCorrect && (
              <div className="flex items-start gap-2">
                <span className="text-sm font-medium text-muted-foreground min-w-20">
                  正確答案:
                </span>
                <span className="text-sm text-green-600">
                  {JSON.stringify(correctAnswer)}
                </span>
              </div>
            )}
          </div>

          {/* 詳解 */}
          {explanation && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-2">📖 詳解</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {explanation}
                </p>
              </div>
            </>
          )}

          {/* 相關技能 */}
          {skills.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-3">🎯 相關技能</h4>
                <div className="space-y-2">
                  {skills.map((skill) => (
                    <SkillTag key={skill.skill_id} skill={skill} />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Session 統計 */}
          <Separator />
          <ExerciseSessionStats stats={sessionStats} />

          {/* 操作按鈕 */}
          <div className="flex gap-3 pt-2">
            <Button onClick={onNext} className="flex-1" size="lg">
              下一題
            </Button>
            <Button
              onClick={onComplete}
              variant="outline"
              className="flex-1"
              size="lg"
            >
              結束練習
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
);
