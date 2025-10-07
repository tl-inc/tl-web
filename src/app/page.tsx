'use client';

import { useHealth } from '@/hooks/useApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const { data: health, isLoading, isError } = useHealth();

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              TL Web Platform
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Teaching & Learning Content Management System
            </p>
          </div>

          {/* API Status Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                API 連線狀態
              </CardTitle>
              <CardDescription>
                FastAPI Backend 健康檢查
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  {isLoading && (
                    <>
                      <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
                      <span className="text-gray-700 dark:text-gray-300">檢查中...</span>
                    </>
                  )}
                  {!isLoading && !isError && health && (
                    <>
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-gray-100">
                          連線正常
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Status: {health.status}
                        </div>
                      </div>
                    </>
                  )}
                  {!isLoading && isError && (
                    <>
                      <XCircle className="h-6 w-6 text-red-500" />
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-gray-100">
                          連線失敗
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          請確認 API 服務是否啟動
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}
                </div>
              </div>

              {health && (
                <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  最後更新: {new Date(health.timestamp).toLocaleString('zh-TW')}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Technology Stack Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>技術棧</CardTitle>
              <CardDescription>
                本專案使用的核心技術
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <TechBadge name="Next.js 14" />
                <TechBadge name="TypeScript" />
                <TechBadge name="Tailwind CSS" />
                <TechBadge name="shadcn/ui" />
                <TechBadge name="React Query" />
                <TechBadge name="Zustand" />
                <TechBadge name="Axios" />
                <TechBadge name="Zod" />
                <TechBadge name="React Hook Form" />
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/paper-configuration">
                考卷設定
              </Link>
            </Button>
            <Button size="lg" variant="outline" disabled>
              進入管理後台
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="http://localhost:8000/docs" target="_blank" rel="noopener noreferrer">
                查看 API 文檔
              </a>
            </Button>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-8">
            <p>Infrastructure 建設完成 ✓</p>
          </div>
        </div>
      </div>
    </main>
  );
}

function TechBadge({ name }: { name: string }) {
  return (
    <div className="flex items-center justify-center px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-md text-sm font-medium">
      {name}
    </div>
  );
}
