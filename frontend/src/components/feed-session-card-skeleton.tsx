import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface FeedSessionCardSkeletonProps {
  className?: string;
}

/**
 * Mirrors the layout of a single feed/hobby session item row:
 * [icon] [title + description] [badge]
 */
export function FeedSessionCardSkeleton({
  className,
}: FeedSessionCardSkeletonProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-xl bg-muted/50 px-4 py-4',
        className,
      )}
    >
      {/* Icon placeholder */}
      <Skeleton className="size-8 shrink-0 rounded-full" />

      {/* Title + description */}
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-3.5 w-2/5 rounded" />
        <Skeleton className="h-3 w-3/5 rounded" />
      </div>

      {/* Badge / count placeholder */}
      <Skeleton className="h-6 w-16 shrink-0 rounded-full" />
    </div>
  );
}
