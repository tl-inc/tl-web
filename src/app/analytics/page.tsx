'use client';

import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card } from '@/components/ui/card';
import type { ItemType, ItemSetType } from '@/types/api';
import { analyticsService } from '@/lib/api/analytics';

// Dynamically import Recharts to reduce initial bundle size
const Radar = dynamic(() => import('recharts').then(mod => mod.Radar), { ssr: false });
const RadarChart = dynamic(() => import('recharts').then(mod => mod.RadarChart), { ssr: false });
const PolarGrid = dynamic(() => import('recharts').then(mod => mod.PolarGrid), { ssr: false });
const PolarAngleAxis = dynamic(() => import('recharts').then(mod => mod.PolarAngleAxis), { ssr: false });
const PolarRadiusAxis = dynamic(() => import('recharts').then(mod => mod.PolarRadiusAxis), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });
const Legend = dynamic(() => import('recharts').then(mod => mod.Legend), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });

interface ItemTypeLevel {
  item_type: ItemType;
  level: number;
  accuracy: number | null;
  max_level: number;
}

interface ItemSetTypeLevel {
  item_set_type: ItemSetType;
  level: number;
  accuracy: number | null;
  max_level: number;
}

interface AnalyticsData {
  item_type_levels: ItemTypeLevel[];
  item_set_type_levels: ItemSetTypeLevel[];
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const data = await analyticsService.getMyAnalytics();
      setAnalytics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知錯誤');
    } finally {
      setLoading(false);
    }
  };

  // Memoize radar data to avoid expensive recalculations on every render
  const radarData = useMemo(() => {
    if (!analytics) return [];

    // Combine all types and calculate percentage
    const allTypes = [
      ...analytics.item_type_levels.map(item => ({
        name: item.item_type.name,
        percentage: Math.round((item.level / item.max_level) * 100),
        level: item.level,
        maxLevel: item.max_level
      })),
      ...analytics.item_set_type_levels.map(item => ({
        name: item.item_set_type.name,
        percentage: Math.round((item.level / item.max_level) * 100),
        level: item.level,
        maxLevel: item.max_level
      }))
    ];

    return allTypes;
  }, [analytics]);

  if (loading) {
    return (
      <ProtectedRoute>
        <SidebarLayout>
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-gray-600 dark:text-gray-400">載入中...</div>
          </div>
        </SidebarLayout>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <SidebarLayout>
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-red-600 dark:text-red-400">錯誤: {error}</div>
          </div>
        </SidebarLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <SidebarLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                能力分析
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                查看您在各題型的能力等級分布
              </p>
            </div>

            {/* Radar Chart */}
            <Card className="p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                能力雷達圖
              </h2>
              <div className="w-full h-[500px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar
                      name="能力百分比"
                      dataKey="percentage"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.6}
                    />
                    <Legend />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded shadow-lg">
                              <p className="font-semibold text-gray-900 dark:text-gray-100">{data.name}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                等級: {data.level} / {data.maxLevel}
                              </p>
                              <p className="text-sm text-blue-600 dark:text-blue-400">
                                百分比: {data.percentage}%
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Item Types Table */}
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  單題能力等級
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">
                          題型
                        </th>
                        <th className="text-center py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">
                          等級
                        </th>
                        <th className="text-center py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">
                          近期命中率
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics?.item_type_levels.map((item) => (
                        <tr
                          key={item.item_type.id}
                          className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        >
                          <td className="py-3 px-4 text-gray-900 dark:text-gray-100">
                            {item.item_type.name}
                          </td>
                          <td className="text-center py-3 px-4">
                            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold">
                              {item.level}
                            </span>
                          </td>
                          <td className="text-center py-3 px-4 text-gray-700 dark:text-gray-300">
                            {item.accuracy !== null
                              ? `${(Number(item.accuracy) * 100).toFixed(1)}%`
                              : '-'}
                          </td>
                        </tr>
                      ))}
                      {(!analytics?.item_type_levels || analytics.item_type_levels.length === 0) && (
                        <tr>
                          <td colSpan={3} className="text-center py-8 text-gray-500 dark:text-gray-400">
                            暫無資料
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Item Set Types Table */}
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  題組能力等級
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">
                          題型
                        </th>
                        <th className="text-center py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">
                          等級
                        </th>
                        <th className="text-center py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">
                          近期命中率
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics?.item_set_type_levels.map((item) => (
                        <tr
                          key={item.item_set_type.id}
                          className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        >
                          <td className="py-3 px-4 text-gray-900 dark:text-gray-100">
                            {item.item_set_type.name}
                          </td>
                          <td className="text-center py-3 px-4">
                            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-bold">
                              {item.level}
                            </span>
                          </td>
                          <td className="text-center py-3 px-4 text-gray-700 dark:text-gray-300">
                            {item.accuracy !== null
                              ? `${(Number(item.accuracy) * 100).toFixed(1)}%`
                              : '-'}
                          </td>
                        </tr>
                      ))}
                      {(!analytics?.item_set_type_levels || analytics.item_set_type_levels.length === 0) && (
                        <tr>
                          <td colSpan={3} className="text-center py-8 text-gray-500 dark:text-gray-400">
                            暫無資料
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </SidebarLayout>
    </ProtectedRoute>
  );
}
