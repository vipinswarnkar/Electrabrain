import { Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { PageContainer } from '@/components/layout/PageContainer';
import { LoadingState } from '@/components/ui/LoadingState';
import { routes } from '@/routes';

const router = createBrowserRouter(routes);

function PageLoader() {
  return (
    <PageContainer>
      <LoadingState message="Loading page..." />
    </PageContainer>
  );
}

export function AppRouter() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <RouterProvider router={router} />
      </Suspense>
    </ErrorBoundary>
  );
}
