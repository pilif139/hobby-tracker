import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Clock3, Compass, Shapes, Sparkles, TriangleAlert } from 'lucide-react';
import type {
  GetHobbyUserByUserId200ResponseInner,
  GetUserById200Response,
} from '@/api/generated/api';
import { hobbyApiClient, userApiClient } from '@/api';
import EmptyState from '@/components/empty-state';
import { FeedListSkeleton } from '@/components/feed-list-skeleton';
import Header from '@/components/header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import { requireAuth } from '@/modules/auth/route-guards';
import { useCurrentUser } from '@/modules/auth/current-user/CurrentUserContext';

export const Route = createFileRoute('/')({
  beforeLoad: requireAuth,
  component: App,
});

function App() {
  const { currentUser } = useCurrentUser();

  const userId = currentUser?.id;

  const profileQuery = useQuery<GetUserById200Response>({
    queryKey: ['dashboard-profile', userId],
    queryFn: async () => {
      const res = await userApiClient.getUserById({ id: userId as string });
      return res.data;
    },
    enabled: Boolean(userId),
  });

  const hobbiesQuery = useQuery<Array<GetHobbyUserByUserId200ResponseInner>>({
    queryKey: ['dashboard-hobbies', userId],
    queryFn: async () => {
      const res = await hobbyApiClient.getHobbyUserByUserId({
        userId: userId as string,
      });
      return res.data;
    },
    enabled: Boolean(userId),
  });

  const profile = profileQuery.data;
  const hobbies = hobbiesQuery.data ?? [];
  const hasSessions = (profile?.hobbySessionsCount ?? 0) > 0;
  const hasHobbies = hobbies.length > 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:py-8">
        {/* Welcome banner */}
        <section className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium text-primary">Welcome back</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
            Your hobby dashboard
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Keep an eye on your recent progress and the hobbies on your profile.
          </p>
        </section>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-2">
          {/* Session feed */}
          {profileQuery.isLoading ? (
            <FeedListSkeleton
              title="Session feed"
              description="A quick view of your recent activity and tracked sessions."
            />
          ) : profileQuery.isError ? (
            <SectionError message="We couldn't load your session activity right now." />
          ) : (
            <Card className="min-h-80">
              <CardHeader>
                <CardTitle>Session feed</CardTitle>
                <CardDescription>
                  A quick view of your recent activity and tracked sessions.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-center">
                {!hasSessions ? (
                  <EmptyState
                    icon={Compass}
                    title="No sessions yet"
                    description="Your adventures will appear here. Create your first session above!"
                  />
                ) : (
                  <ItemGroup>
                    <Item variant="muted" className="rounded-xl px-4 py-4">
                      <ItemMedia variant="icon">
                        <Clock3 className="size-4" />
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle>
                          {profile?.hobbySessionsCount ?? 0} sessions recorded
                        </ItemTitle>
                        <ItemDescription>
                          You&apos;re building momentum. A full session feed is
                          coming next.
                        </ItemDescription>
                      </ItemContent>
                    </Item>
                    <Item variant="muted" className="rounded-xl px-4 py-4">
                      <ItemMedia variant="icon">
                        <Sparkles className="size-4" />
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle>
                          {profile?.hobbiesCount ?? 0} hobbies tracked
                        </ItemTitle>
                        <ItemDescription>
                          Each session makes your dashboard come alive.
                        </ItemDescription>
                      </ItemContent>
                    </Item>
                  </ItemGroup>
                )}
              </CardContent>
            </Card>
          )}

          {/* Hobbies list */}
          {hobbiesQuery.isLoading ? (
            <FeedListSkeleton
              title="Your hobbies"
              description="Hobbies added to your profile, with their session counts."
            />
          ) : hobbiesQuery.isError ? (
            <SectionError message="We couldn't load your hobbies right now." />
          ) : (
            <Card className="min-h-80">
              <CardHeader>
                <CardTitle>Your hobbies</CardTitle>
                <CardDescription>
                  Hobbies added to your profile, with their session counts.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-center">
                {!hasHobbies ? (
                  <EmptyState
                    icon={Shapes}
                    title="No hobbies on your profile"
                    description="Add your first hobby to start tracking the time you invest in it."
                  />
                ) : (
                  <ItemGroup>
                    {hobbies.map((hobby) => (
                      <HobbyItem
                        key={hobby.id ?? hobby.name ?? 'hobby'}
                        hobby={hobby}
                      />
                    ))}
                  </ItemGroup>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}

function HobbyItem({ hobby }: { hobby: GetHobbyUserByUserId200ResponseInner }) {
  return (
    <Item variant="muted" className="rounded-xl px-4 py-4">
      <ItemMedia variant="icon">
        <Shapes className="size-4" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{hobby.name ?? 'Unnamed hobby'}</ItemTitle>
        <ItemDescription>
          {hobby.description ?? 'No description yet.'}
        </ItemDescription>
      </ItemContent>
      <div className="ml-auto rounded-full bg-background px-3 py-1 text-xs font-medium text-muted-foreground ring-1 ring-border">
        {hobby.sessionCount} sessions
      </div>
    </Item>
  );
}

function SectionError({ message }: { message: string }) {
  return (
    <Card className="min-h-80">
      <CardContent className="flex h-full flex-col justify-center">
        <div className="flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-4 text-sm text-destructive">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" />
          <p>{message}</p>
        </div>
      </CardContent>
    </Card>
  );
}
