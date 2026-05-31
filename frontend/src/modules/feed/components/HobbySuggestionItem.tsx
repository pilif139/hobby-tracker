import { Plus } from 'lucide-react';
import type { GetFeedHobbySuggestions200ResponseSuggestionsInner } from '@/api/generated/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface HobbySuggestionItemProps {
  hobby: GetFeedHobbySuggestions200ResponseSuggestionsInner;
  onAdd: (hobbyId: string) => void;
  isAddPending: boolean;
}

export function HobbySuggestionItem({
  hobby,
  onAdd,
  isAddPending,
}: HobbySuggestionItemProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="flex flex-col overflow-hidden">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-medium leading-none">
            {hobby.name}
          </span>
          <Badge variant="secondary" className="px-1 text-[10px] h-4">
            {hobby.userCount} users
          </Badge>
        </div>
        <p className="line-clamp-1 text-xs text-muted-foreground mt-1">
          {hobby.description || 'No description available'}
        </p>
      </div>
      <Button
        size="sm"
        variant="ghost"
        className="h-8 w-8 p-0 shrink-0 hover:bg-primary/10 hover:text-primary"
        onClick={() => hobby.id && onAdd(hobby.id)}
        disabled={isAddPending}
      >
        <Plus className="h-4 w-4" />
        <span className="sr-only">Add {hobby.name}</span>
      </Button>
    </div>
  );
}
