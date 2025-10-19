/**
 * ExerciseSessionSummary 元件
 *
 * 顯示 Session 結算報告
 */
import { memo } from 'react';
import { ArrowUp, ArrowDown, Trophy, Target, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import type { SessionSummary } from '@/types/exerciseSession';

interface ExerciseSessionSummaryProps {
  summary: SessionSummary;
  onRestart: () => void;
  onBackHome: () => void;
  className?: string;
}

export const ExerciseSessionSummary = memo(function ExerciseSessionSummary({
  summary,
  onRestart,
  onBackHome,
  className,
}: ExerciseSessionSummaryProps) {
  const accuracyPercent = Math.round(summary.basic_stats.accuracy * 100);

  return (
    <div className={cn('w-full max-w-2xl mx-auto space-y-6', className)}>
      {/* 標題 */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">🎉 練習結束!</h1>
        <p className="text-muted-foreground">太棒了!你完成了這次練習</p>
      </div>

      {/* 基礎統計 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            基礎統計
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">
                {summary.basic_stats.total_questions}
              </div>
              <div className="text-sm text-muted-foreground">總題數</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">
                {accuracyPercent}%
              </div>
              <div className="text-sm text-muted-foreground">正確率</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-500">
                {summary.basic_stats.max_streak}
              </div>
              <div className="text-sm text-muted-foreground">最高連勝</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 技能表現 */}
      {summary.skill_performance.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              技能表現
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {summary.skill_performance.map((skill) => {
              const skillAccuracyPercent = Math.round(skill.accuracy * 100);
              return (
                <div key={skill.skill_id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{skill.skill_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {skill.correct}/{skill.total} 題正確
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {skillAccuracyPercent}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        等級 {skill.current_level}
                      </div>
                    </div>
                  </div>
                  <Progress value={skillAccuracyPercent} />
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* 等級變化 */}
      {summary.level_changes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              等級變化
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {summary.level_changes.map((change) => (
              <div
                key={change.exercise_type_id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted"
              >
                <span className="font-medium">{change.exercise_type_name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    Lv.{change.before}
                  </span>
                  <span className="text-muted-foreground">→</span>
                  <span className="font-bold text-primary">
                    Lv.{change.after}
                  </span>
                  {change.change > 0 ? (
                    <ArrowUp className="h-4 w-4 text-green-600" />
                  ) : change.change < 0 ? (
                    <ArrowDown className="h-4 w-4 text-red-600" />
                  ) : null}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* 操作按鈕 */}
      <div className="flex gap-3">
        <Button onClick={onRestart} className="flex-1" size="lg">
          再來一輪
        </Button>
        <Button
          onClick={onBackHome}
          variant="outline"
          className="flex-1"
          size="lg"
        >
          返回首頁
        </Button>
      </div>
    </div>
  );
});
