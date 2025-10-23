'use client';

import { memo, useMemo } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type { ExerciseTypeGroup, RadarChartData } from '@/types/analytics';
import { EmptyState } from '@/components/common/EmptyState';

/**
 * Props for ExerciseTypeRadarChart component
 */
export interface ExerciseTypeRadarChartProps {
  /** 題型分組資料 */
  group: ExerciseTypeGroup;
  /** 點擊題型時的回調函數 (可選) */
  onExerciseTypeClick?: (exerciseTypeId: number) => void;
}

/**
 * Custom Tooltip for Radar Chart
 */
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: RadarChartData;
  }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const data = payload[0].payload;
  const correctRatePercent = (data.recent_correct_rate * 100).toFixed(1);

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg">
      <p className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {data.subject}
      </p>
      <div className="space-y-1 text-sm">
        <p className="text-gray-700 dark:text-gray-300">
          <span className="font-medium">等級:</span> {data.level} / {data.max_level}
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          <span className="font-medium">最近嘗試:</span> {data.recent_attempts} 次
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          <span className="font-medium">答對率:</span> {correctRatePercent}%
        </p>
      </div>
    </div>
  );
};

/**
 * Exercise Type Radar Chart Component
 *
 * 顯示題型分組的雷達圖,展示使用者在各題型的等級
 * 每個雷達圖的刻度範圍動態調整為該分組內最大的 max_level
 */
export const ExerciseTypeRadarChart = memo(
  ({ group, onExerciseTypeClick }: ExerciseTypeRadarChartProps) => {
    // 轉換資料格式為 recharts 需要的格式
    const radarData = useMemo<RadarChartData[]>(() => {
      if (!group.exercise_types || group.exercise_types.length === 0) {
        return [];
      }
      return group.exercise_types.map((et) => ({
        subject: et.name,
        level: et.level,
        max_level: et.max_level,
        fullMark: et.max_level,
        id: et.id,
        recent_attempts: et.recent_attempts,
        recent_correct_rate: et.recent_correct_rate,
      }));
    }, [group.exercise_types]);

    // 計算該分組的最大 max_level (用於雷達圖的 domain)
    const maxLevelInGroup = useMemo(() => {
      if (radarData.length === 0) {
        return 5; // 預設值
      }
      return Math.max(...radarData.map((data) => data.max_level));
    }, [radarData]);

    // 處理點擊事件
    const handleClick = (data: unknown) => {
      if (onExerciseTypeClick && data && typeof data === 'object' && 'id' in data) {
        onExerciseTypeClick((data as RadarChartData).id);
      }
    };

    // 空資料處理
    if (radarData.length === 0) {
      return (
        <div className="flex items-center justify-center h-[400px]">
          <EmptyState
            message="此分組尚無題型資料"
            description="完成練習後即可查看統計"
            spacing="compact"
          />
        </div>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={radarData}>
          <PolarGrid
            stroke="#e5e7eb"
            strokeWidth={1}
            className="dark:!stroke-gray-600"
          />
          <PolarAngleAxis
            dataKey="subject"
            tick={{
              fill: '#6b7280',
              fontSize: 14,
              className: 'dark:!fill-gray-300'
            }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, maxLevelInGroup]}
            tick={{
              fill: '#9ca3af',
              fontSize: 12,
              className: 'dark:!fill-gray-400'
            }}
          />
          <Radar
            name="等級"
            dataKey="level"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.6}
            strokeWidth={2}
            className="cursor-pointer hover:fill-opacity-80 transition-opacity dark:!stroke-blue-400 dark:!fill-blue-400"
            onClick={handleClick}
          />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    );
  }
);

ExerciseTypeRadarChart.displayName = 'ExerciseTypeRadarChart';
