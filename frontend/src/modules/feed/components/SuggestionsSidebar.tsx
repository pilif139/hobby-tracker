import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { TrendingUp, Users } from 'lucide-react';
import { toast } from 'sonner';
import { feedQueryKeys } from '../model/query-keys';
import { HobbySuggestionItem } from './HobbySuggestionItem';
import { SuggestionListSkeleton } from './SuggestionListSkeleton';
import { UserSuggestionItem } from './UserSuggestionItem';
import type { ApiClientError } from '@/api';
import { feedApiClient, followApiClient, hobbyApiClient } from '@/api';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCurrentUser } from '@/modules/auth/current-user/CurrentUserContext';

export default function SuggestionsSidebar() {
  const { currentUser } = useCurrentUser();
  const queryClient = useQueryClient();

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

  const isEmpty = (query: { isLoading: boolean; data?: Array<unknown> }) =>
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
                  <SuggestionListSkeleton />
                ) : isEmpty(hobbySuggestions) ? (
                  <p className="py-6 text-center text-xs text-muted-foreground">
                    No hobby-based suggestions.
                  </p>
                ) : (
                  <div className="divide-y divide-border/40">
                    {hobbySuggestions.data?.map((user) => (
                      <UserSuggestionItem
                        key={user.id}
                        type="hobby"
                        user={user}
                        onFollow={followMutation.mutate}
                        isFollowPending={followMutation.isPending}
                      />
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
            <TabsContent value="social" className="mt-0">
              <ScrollArea className="h-auto max-h-[350px]">
                {socialSuggestions.isLoading ? (
                  <SuggestionListSkeleton />
                ) : isEmpty(socialSuggestions) ? (
                  <p className="py-6 text-center text-xs text-muted-foreground">
                    No social suggestions.
                  </p>
                ) : (
                  <div className="divide-y divide-border/40">
                    {socialSuggestions.data?.map((user) => (
                      <UserSuggestionItem
                        key={user.id}
                        type="social"
                        user={user}
                        onFollow={followMutation.mutate}
                        isFollowPending={followMutation.isPending}
                      />
                    ))}
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
              <SuggestionListSkeleton />
            ) : isEmpty(trendingHobbies) ? (
              <p className="py-6 text-center text-xs text-muted-foreground">
                No new hobbies to suggest.
              </p>
            ) : (
              <div className="divide-y divide-border/40">
                {trendingHobbies.data?.map((hobby) => (
                  <HobbySuggestionItem
                    key={hobby.id}
                    hobby={hobby}
                    onAdd={addHobbyMutation.mutate}
                    isAddPending={addHobbyMutation.isPending}
                  />
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
