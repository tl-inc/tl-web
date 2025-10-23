'use client';

import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { BackButton } from '@/components/common/BackButton';

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
            <BackButton onClick={handleBack} label="返回程度分析" />

            {/* Header */}
            <PageHeader title="技能分析" align="center" />
          </div>
        </main>
      </SidebarLayout>
    </ProtectedRoute>
  );
}
