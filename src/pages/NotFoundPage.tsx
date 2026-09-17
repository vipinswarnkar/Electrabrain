import { useNavigate } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <PageHeader title="Page not found" subtitle="The requested route does not exist." />
      <EmptyState
        title="404 — Page not found"
        description="This page has not been configured yet or the URL may be incorrect."
        icon={<FileQuestion size={28} />}
        action={
          <Button variant="primary" onClick={() => navigate('/dashboard')}>
            Return to dashboard
          </Button>
        }
      />
    </PageContainer>
  );
}
