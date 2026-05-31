import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { FeedSessionCardSkeleton } from '@/components/feed-session-card-skeleton';

interface FeedListSkeletonProps {
  /** Number of skeleton rows to render. Defaults to 3. */
  rows?: number;
  /** Optional title text for the card header. */
  title?: string;
  /** Optional description text for the card header. */
  description?: string;
}

/**
 * Full-card loading placeholder that mirrors the session feed / hobby list
 * card layout used on the dashboard. Renders a card header with optional
 * title/description skeletons and `rows` item-row skeletons.
 */
export function FeedListSkeleton({
  rows = 3,
  title,
  description,
}: FeedListSkeletonProps) {
  return (
    <Card className="min-h-80">
      <CardHeader>
        <CardTitle>
          {title ?? <Skeleton className="h-4 w-32 rounded" />}
        </CardTitle>
        <CardDescription>
          {description ?? <Skeleton className="h-3 w-56 rounded" />}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        {Array.from({ length: rows }, (_, i) => (
          <FeedSessionCardSkeleton key={i} />
        ))}
      </CardContent>
    </Card>
  );
}
