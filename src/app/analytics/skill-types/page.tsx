'use client';

import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function SkillTypesAnalyticsPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/analytics');
  };

  return (
    <ProtectedRoute>
      <SidebarLayout>
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={handleBack}
              className="mb-6 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回程度分析
            </Button>

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 text-center">
                技能分析
              </h1>
            </div>
          </div>
        </main>
      </SidebarLayout>
    </ProtectedRoute>
  );
}
