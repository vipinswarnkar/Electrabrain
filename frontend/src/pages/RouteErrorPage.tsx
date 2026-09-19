import { isRouteErrorResponse, useNavigate, useRouteError } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { ErrorState } from '@/components/ui/ErrorState';
import { Button } from '@/components/ui/Button';

export function RouteErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  let title = 'Page error';
  let description = 'Unable to load this page. Please try again.';

  if (isRouteErrorResponse(error)) {
    title = error.status === 404 ? 'Page not found' : `Error ${error.status}`;
    description = error.statusText || description;
  } else if (error instanceof Error) {
    description = error.message;
  }

  return (
    <PageContainer>
      <ErrorState
        title={title}
        description={description}
        action={
          <>
            <Button variant="primary" onClick={() => navigate(0)}>
              Retry
            </Button>
            <Button variant="secondary" onClick={() => navigate('/dashboard')}>
              Back to dashboard
            </Button>
          </>
        }
      />
    </PageContainer>
  );
}
