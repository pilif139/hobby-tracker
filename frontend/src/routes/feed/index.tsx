import { createFileRoute } from '@tanstack/react-router';
import FeedPage from '@/modules/feed/page/FeedPage';
import { requireAuth } from '@/modules/auth/route-guards';

export const Route = createFileRoute('/feed/')({
  beforeLoad: requireAuth,
  component: FeedPage,
});
