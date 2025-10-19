/**
 * SkillTag 元件
 *
 * 顯示技能資訊與使用者等級
 */
import { memo } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { SkillInfo } from '@/types/exerciseSession';

interface SkillTagProps {
  skill: SkillInfo;
  className?: string;
}

/**
 * 取得等級文字與顏色
 */
function getLevelInfo(level: number): { text: string; variant: string } {
  switch (level) {
    case 0:
      return { text: '待定', variant: 'secondary' };
    case 1:
      return { text: '不會', variant: 'destructive' };
    case 2:
      return { text: '不熟', variant: 'destructive' };
    case 3:
      return { text: '普通', variant: 'default' };
    case 4:
      return { text: '熟練', variant: 'default' };
    case 5:
      return { text: '精通', variant: 'default' };
    default:
      return { text: '待定', variant: 'secondary' };
  }
}

/**
 * 取得星星顯示
 */
function getStars(level: number): string {
  return '⭐'.repeat(level);
}

export const SkillTag = memo(function SkillTag({
  skill,
  className,
}: SkillTagProps) {
  const levelInfo = getLevelInfo(skill.your_level);
  const stars = getStars(skill.your_level);

  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-lg border p-3',
        className
      )}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{skill.name}</span>
          <Badge variant={levelInfo.variant as never} className="text-xs">
            {levelInfo.text}
          </Badge>
        </div>
        {skill.type && (
          <p className="text-xs text-muted-foreground mt-1">
            {skill.type === 'lexicon' && '詞彙'}
            {skill.type === 'grammar' && '文法'}
            {skill.type === 'concept' && '概念'}
            {skill.type === 'phrase' && '片語'}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-lg" title={`等級 ${skill.your_level}`}>
          {stars || '—'}
        </span>
      </div>
    </div>
  );
});
