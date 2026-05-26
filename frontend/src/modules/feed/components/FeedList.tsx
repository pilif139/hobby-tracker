import { useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { feedQueryKeys } from '../model/query-keys';
import { FeedSessionCard } from './FeedSessionCard';
import { feedApiClient } from '@/api';
import { Skeleton } from '@/components/ui/skeleton';

export default function FeedList() {
  const { ref, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: feedQueryKeys.timeline(),
    queryFn: async ({ pageParam }) => {
      const response = await feedApiClient.getFeed({
        cursor: pageParam,
        limit: 10,
      });
      return response.data;
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card p-4 space-y-4"
          >
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-24 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-8 text-center">
        <p className="text-destructive font-medium">Failed to load feed</p>
        <p className="text-sm text-destructive/80 mt-1">
          {error instanceof Error ? error.message : 'Something went wrong'}
        </p>
      </div>
    );
  }

  const sessions = data?.pages.flatMap((page) => page.sessions) ?? [];

  if (sessions.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-12 text-center bg-muted/30">
        <h3 className="text-lg font-semibold text-foreground">
          Your feed is empty
        </h3>
        <p className="text-muted-foreground mt-2 max-w-xs mx-auto">
          Follow other users or create your first hobby session to see activity
          here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {sessions.map((session) => (
        <FeedSessionCard key={session.id} session={session} />
      ))}

      {hasNextPage && (
        <div ref={ref} className="py-4 flex justify-center">
          {isFetchingNextPage && (
            <Skeleton className="h-8 w-8 rounded-full animate-spin" />
          )}
        </div>
      )}
    </div>
  );
}
