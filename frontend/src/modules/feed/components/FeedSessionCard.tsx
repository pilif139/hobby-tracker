import { differenceInMinutes, format, formatDistanceToNow } from 'date-fns';
import { FeedImageDialog } from './FeedImageDialog';
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
    <Card className="overflow-hidden border-border/60 shadow-sm dark:bg-card/40 dark:backdrop-blur-sm transition-all duration-200 hover:shadow-md hover:border-border/80">
      <CardHeader className="flex flex-row items-center space-y-0 gap-3 p-3">
        <Avatar className="h-9 w-9">
          <AvatarImage
            src={user.avatarUrl ?? undefined}
            alt={user.name ?? ''}
          />
          <AvatarFallback>{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[15px] truncate">
              {user.name}
            </span>
            <Badge
              variant="outline"
              className="shrink-0 px-1.5 py-0 text-[10px] font-bold uppercase tracking-wider rounded-sm border-primary/20 bg-primary/5 text-primary/80"
            >
              {hobby.name}
            </Badge>
          </div>
          <div className="text-[11px] text-muted-foreground">
            {created && (
              <span>{formatDistanceToNow(created, { addSuffix: true })}</span>
            )}
            {durationDisplay && <span> • {durationDisplay} session</span>}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3 pt-0 space-y-3">
        {notes && (
          <p className="text-[15px] text-foreground whitespace-pre-wrap leading-relaxed">
            {notes}
          </p>
        )}

        {imageUrls.length > 0 && <FeedImageDialog imageUrls={imageUrls} />}

        {start && end && (
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium opacity-80">
            {format(start, 'MMM d, h:mm a')} - {format(end, 'h:mm a')}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
