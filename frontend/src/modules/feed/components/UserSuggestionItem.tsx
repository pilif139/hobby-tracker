import { UserPlus } from 'lucide-react';
import type {
  GetFeedFollowSuggestionsHobby200ResponseSuggestionsInner,
  GetFeedFollowSuggestionsSocial200ResponseSuggestionsInner,
} from '@/api/generated/api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

type UserSuggestionItemProps =
  | {
      type: 'hobby';
      user: GetFeedFollowSuggestionsHobby200ResponseSuggestionsInner;
      onFollow: (userId: string) => void;
      isFollowPending: boolean;
    }
  | {
      type: 'social';
      user: GetFeedFollowSuggestionsSocial200ResponseSuggestionsInner;
      onFollow: (userId: string) => void;
      isFollowPending: boolean;
    };

export function UserSuggestionItem({
  type,
  user,
  onFollow,
  isFollowPending,
}: UserSuggestionItemProps) {
  const subtitle =
    type === 'hobby'
      ? `${user.sharedHobbyCount} shared`
      : `${user.mutualConnectionCount} mutual`;

  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="flex items-center gap-3 overflow-hidden">
        <Avatar className="h-9 w-9 border border-border/50 shrink-0">
          <AvatarImage src={user.avatarUrl ?? undefined} />
          <AvatarFallback className="text-xs">
            {user.name?.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col overflow-hidden">
          <span className="truncate text-sm font-medium leading-none">
            {user.name}
          </span>
          <span className="truncate text-xs text-muted-foreground mt-1">
            {subtitle}
          </span>
        </div>
      </div>
      <Button
        size="sm"
        variant="outline"
        className="h-8 w-8 p-0 shrink-0"
        onClick={() => user.id && onFollow(user.id)}
        disabled={isFollowPending}
      >
        <UserPlus className="h-4 w-4" />
        <span className="sr-only">Follow {user.name}</span>
      </Button>
    </div>
  );
}
