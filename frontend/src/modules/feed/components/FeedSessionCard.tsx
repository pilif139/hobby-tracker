import { differenceInMinutes, format, formatDistanceToNow } from 'date-fns';
import type { GetFeed200ResponseSessionsInner } from '@/api/generated';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface FeedSessionCardProps {
  session: GetFeed200ResponseSessionsInner;
}

export function FeedSessionCard({ session }: FeedSessionCardProps) {
  const { user, hobby, startTime, endTime, notes, imageUrls, createdAt } =
    session;

  const start = startTime ? new Date(startTime) : null;
  const end = endTime ? new Date(endTime) : null;
  const created = createdAt ? new Date(createdAt) : null;

  const durationInMinutes = start && end ? differenceInMinutes(end, start) : 0;
  const hours = Math.floor(durationInMinutes / 60);
  const minutes = durationInMinutes % 60;

  const durationDisplay = [
    hours > 0 ? `${hours}h` : null,
    minutes > 0 ? `${minutes}m` : null,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Card className="overflow-hidden border-border/60 shadow-sm dark:bg-card/40 dark:backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center space-y-0 gap-4 p-4">
        <Avatar>
          <AvatarImage
            src={user.avatarUrl ?? undefined}
            alt={user.name ?? ''}
          />
          <AvatarFallback>{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold truncate">{user.name}</span>
            <Badge
              variant="secondary"
              className="shrink-0 dark:bg-muted/80 dark:text-muted-foreground"
            >
              {hobby.name}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground">
            {created && (
              <span>{formatDistanceToNow(created, { addSuffix: true })}</span>
            )}
            {durationDisplay && <span> • {durationDisplay} session</span>}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0 space-y-4">
        {notes && (
          <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
            {notes}
          </p>
        )}

        {imageUrls.length > 0 && (
          <div
            className={`grid gap-2 ${
              imageUrls.length === 1
                ? 'grid-cols-1'
                : imageUrls.length === 2
                  ? 'grid-cols-2'
                  : 'grid-cols-2 sm:grid-cols-3'
            }`}
          >
            {imageUrls.map((url, index) => (
              <div
                key={index}
                className={`relative aspect-square rounded-md overflow-hidden border border-border/60 bg-muted/50 dark:bg-muted/20 ${
                  imageUrls.length === 3 && index === 0
                    ? 'sm:col-span-2 sm:row-span-2'
                    : ''
                }`}
              >
                <img
                  src={url}
                  alt={`Session image ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {start && end && (
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
            {format(start, 'MMM d, h:mm a')} - {format(end, 'h:mm a')}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
