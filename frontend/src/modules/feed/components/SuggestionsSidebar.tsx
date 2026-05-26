import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, TrendingUp, UserPlus, Users } from 'lucide-react';
import { toast } from 'sonner';
import { feedQueryKeys } from '../model/query-keys';
import type {
  GetFeedFollowSuggestionsHobby200ResponseSuggestionsInner,
  GetFeedFollowSuggestionsSocial200ResponseSuggestionsInner,
  GetFeedHobbySuggestions200ResponseSuggestionsInner,
} from '@/api/generated/api';
import type { ApiClientError } from '@/api';
import { feedApiClient, followApiClient, hobbyApiClient } from '@/api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useCurrentUser } from '@/modules/auth/current-user/CurrentUserContext';

export default function SuggestionsSidebar() {
  const { currentUser } = useCurrentUser();
  const queryClient = useQueryClient();

  // Queries
  const hobbySuggestions = useQuery({
    queryKey: [...feedQueryKeys.suggestions(), 'hobby-follow'],
    queryFn: async () => {
      const response = await feedApiClient.getFeedFollowSuggestionsHobby({
        limit: 5,
      });
      return response.data.suggestions;
    },
  });

  const socialSuggestions = useQuery({
    queryKey: [...feedQueryKeys.suggestions(), 'social-follow'],
    queryFn: async () => {
      const response = await feedApiClient.getFeedFollowSuggestionsSocial({
        limit: 5,
      });
      return response.data.suggestions;
    },
  });

  const trendingHobbies = useQuery({
    queryKey: [...feedQueryKeys.suggestions(), 'trending-hobbies'],
    queryFn: async () => {
      const response = await feedApiClient.getFeedHobbySuggestions({
        limit: 5,
      });
      return response.data.suggestions;
    },
  });

  // Mutations
  const followMutation = useMutation({
    mutationFn: async (followingId: string) => {
      if (!currentUser?.id) throw new Error('User not logged in');
      await followApiClient.postFollow({
        postFollowRequest: {
          followerId: currentUser.id,
          followingId,
        },
      });
    },
    onSuccess: () => {
      toast.success('Following user');
      queryClient.invalidateQueries({ queryKey: feedQueryKeys.suggestions() });
      queryClient.invalidateQueries({ queryKey: feedQueryKeys.timeline() });
    },
    onError: (error: ApiClientError) => {
      toast.error(error.message || 'Failed to follow user');
    },
  });

  const addHobbyMutation = useMutation({
    mutationFn: async (hobbyId: string) => {
      await hobbyApiClient.postHobbyAddToProfileByHobbyId({ hobbyId });
    },
    onSuccess: () => {
      toast.success('Hobby added to profile');
      queryClient.invalidateQueries({ queryKey: feedQueryKeys.suggestions() });
      queryClient.invalidateQueries({
        queryKey: feedQueryKeys.myHobbies(currentUser?.id ?? ''),
      });
    },
    onError: (error: ApiClientError) => {
      toast.error(error.message || 'Failed to add hobby');
    },
  });

  const renderUserSuggestion = (
    user:
      | GetFeedFollowSuggestionsHobby200ResponseSuggestionsInner
      | GetFeedFollowSuggestionsSocial200ResponseSuggestionsInner,
    type: 'hobby' | 'social',
  ) => (
    <div
      key={user.id ?? ''}
      className="flex items-center justify-between gap-4 py-3"
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <Avatar className="h-9 w-9 border border-border/50">
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
            {type === 'hobby'
              ? `${(user as GetFeedFollowSuggestionsHobby200ResponseSuggestionsInner).sharedHobbyCount} shared hobbies`
              : `${(user as GetFeedFollowSuggestionsSocial200ResponseSuggestionsInner).mutualConnectionCount} mutual connections`}
          </span>
        </div>
      </div>
      <Button
        size="sm"
        variant="outline"
        className="h-8 w-8 p-0 shrink-0"
        onClick={() => user.id && followMutation.mutate(user.id)}
        disabled={followMutation.isPending}
      >
        <UserPlus className="h-4 w-4" />
        <span className="sr-only">Follow {user.name}</span>
      </Button>
    </div>
  );

  const renderHobbySuggestion = (
    hobby: GetFeedHobbySuggestions200ResponseSuggestionsInner,
  ) => (
    <div
      key={hobby.id ?? ''}
      className="flex items-center justify-between gap-4 py-3"
    >
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
        onClick={() => hobby.id && addHobbyMutation.mutate(hobby.id)}
        disabled={addHobbyMutation.isPending}
      >
        <Plus className="h-4 w-4" />
        <span className="sr-only">Add {hobby.name}</span>
      </Button>
    </div>
  );

  const renderSkeletons = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-3 py-2">
          <Skeleton className="h-9 w-9 rounded-full shrink-0" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-3 w-[60%]" />
            <Skeleton className="h-3 w-[40%]" />
          </div>
        </div>
      ))}
    </div>
  );

  const isEmpty = (query: any) =>
    !query.isLoading && (!query.data || query.data.length === 0);

  return (
    <div className="space-y-6">
      <Card className="border-border/60 shadow-none dark:bg-card/40">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-semibold">
              Who to follow
            </CardTitle>
          </div>
          <CardDescription className="text-xs">
            Connect with people sharing your interests.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="hobby" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-8">
              <TabsTrigger value="hobby" className="text-[11px]">
                By Hobby
              </TabsTrigger>
              <TabsTrigger value="social" className="text-[11px]">
                Social
              </TabsTrigger>
            </TabsList>
            <TabsContent value="hobby" className="mt-0">
              <ScrollArea className="h-auto max-h-[350px]">
                {hobbySuggestions.isLoading ? (
                  renderSkeletons()
                ) : isEmpty(hobbySuggestions) ? (
                  <p className="py-6 text-center text-xs text-muted-foreground">
                    No hobby-based suggestions.
                  </p>
                ) : (
                  <div className="divide-y divide-border/40">
                    {hobbySuggestions.data?.map((u) =>
                      renderUserSuggestion(u, 'hobby'),
                    )}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
            <TabsContent value="social" className="mt-0">
              <ScrollArea className="h-auto max-h-[350px]">
                {socialSuggestions.isLoading ? (
                  renderSkeletons()
                ) : isEmpty(socialSuggestions) ? (
                  <p className="py-6 text-center text-xs text-muted-foreground">
                    No social suggestions.
                  </p>
                ) : (
                  <div className="divide-y divide-border/40">
                    {socialSuggestions.data?.map((u) =>
                      renderUserSuggestion(u, 'social'),
                    )}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-none dark:bg-card/40">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-semibold">
              Suggested Hobbies
            </CardTitle>
          </div>
          <CardDescription className="text-xs">
            Explore and add new hobbies to your profile.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-auto max-h-[350px]">
            {trendingHobbies.isLoading ? (
              renderSkeletons()
            ) : isEmpty(trendingHobbies) ? (
              <p className="py-6 text-center text-xs text-muted-foreground">
                No new hobbies to suggest.
              </p>
            ) : (
              <div className="divide-y divide-border/40">
                {trendingHobbies.data?.map((h) => renderHobbySuggestion(h))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
