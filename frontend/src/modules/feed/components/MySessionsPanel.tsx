import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function MySessionsPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My sessions</CardTitle>
        <CardDescription>
          Phase 1 scaffold. Stats and filters will be implemented in Phase 4.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-md border border-border/60 p-3">
            <p className="text-xs text-muted-foreground">Total sessions</p>
            <p className="text-lg font-semibold">--</p>
          </div>
          <div className="rounded-md border border-border/60 p-3">
            <p className="text-xs text-muted-foreground">Current streak</p>
            <p className="text-lg font-semibold">--</p>
          </div>
        </div>

        <div className="space-y-2">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex items-center justify-between rounded-md border border-border/60 px-3 py-2"
            >
              <div className="space-y-1">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-18" />
              </div>
              <Badge variant="outline">Soon</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
