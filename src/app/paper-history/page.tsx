import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { PageHeader } from '@/components/common/PageHeader';

export default function PaperHistoryPage() {
  return (
    <ProtectedRoute>
      <SidebarLayout>
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="container mx-auto px-4 py-16">
            <PageHeader title="考卷回顧" align="center" size="large" />
          </div>
        </main>
      </SidebarLayout>
    </ProtectedRoute>
  );
}
