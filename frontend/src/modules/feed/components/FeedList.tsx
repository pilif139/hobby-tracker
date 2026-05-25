import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function FeedList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Feed timeline</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Phase 1 scaffold: feed data rendering will be implemented in Phase 4.
        </p>

        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-lg border border-border/60 p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="space-y-2 w-full">
                  <Skeleton className="h-3 w-36" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="mt-4 h-20 w-full" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
