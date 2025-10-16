import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { SidebarLayout } from '@/components/layout/SidebarLayout';

export default function AnalyticsPage() {
  return (
    <ProtectedRoute>
      <SidebarLayout>
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="container mx-auto px-4 py-16">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 text-center">
              程度分析
            </h1>
          </div>
        </main>
      </SidebarLayout>
    </ProtectedRoute>
  );
}
