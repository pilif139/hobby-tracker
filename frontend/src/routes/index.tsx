import { useQuery } from '@tanstack/react-query';
import { Link, createFileRoute } from '@tanstack/react-router';
import {
  Activity,
  ArrowRight,
  Calendar,
  Clock3,
  Compass,
  Shapes,
  TriangleAlert,
  Trophy,
  Users,
} from 'lucide-react';
import type {
  GetHobbySessionUserByUserId200Response,
  GetHobbyUserByUserId200ResponseInner,
  GetUserById200Response,
} from '@/api/generated/api';
import { hobbyApiClient, hobbySessionApiClient, userApiClient } from '@/api';
import EmptyState from '@/components/empty-state';
import { FeedListSkeleton } from '@/components/feed-list-skeleton';
import { buttonVariants } from '@/components/ui/button';
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

  const statsQuery = useQuery<GetHobbySessionUserByUserId200Response>({
    queryKey: ['dashboard-stats', userId],
    queryFn: async () => {
      const res = await hobbySessionApiClient.getHobbySessionUserByUserId({
        userId: userId as string,
        limit: 1, // We only need stats for now
      });
      return res.data;
    },
    enabled: Boolean(userId),
  });

  const profile = profileQuery.data;
  const hobbies = hobbiesQuery.data ?? [];
  const stats = statsQuery.data?.stats;
  const hasSessions = (profile?.hobbySessionsCount ?? 0) > 0;
  const hasHobbies = hobbies.length > 0;

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:py-8">
        {/* Welcome banner */}
        <section className="flex flex-col items-start justify-between gap-6 rounded-2xl border bg-card p-6 shadow-sm sm:flex-row sm:items-center sm:p-8">
          <div className="flex-1">
            <p className="text-sm font-medium text-primary">Welcome back</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
              Your hobby dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Keep an eye on your recent progress and the hobbies on your
              profile.
            </p>
          </div>
          <Link
            to="/feed"
            className={buttonVariants({
              variant: 'default',
              size: 'lg',
              className:
                'h-12 w-full gap-2 rounded-xl px-8 sm:w-auto font-heading text-xl',
            })}
          >
            Explore activity feed
            <ArrowRight className="size-5" />
          </Link>
        </section>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-2">
          {/* Stats section */}
          {statsQuery.isLoading ? (
            <FeedListSkeleton
              title="Your performance"
              description="A quick overview of your activity and momentum."
            />
          ) : statsQuery.isError ? (
            <SectionError message="We couldn't load your stats right now." />
          ) : (
            <Card className="min-h-80">
              <CardHeader>
                <CardTitle>Your performance</CardTitle>
                <CardDescription>
                  A quick overview of your activity and momentum.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-center">
                {!hasSessions || !stats ? (
                  <EmptyState
                    icon={Compass}
                    title="No stats yet"
                    description="Start tracking your hobby sessions to see your progress here."
                  />
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <StatItem
                      icon={Activity}
                      label="Total Sessions"
                      value={stats.totalCount}
                      description={`${stats.sessionsLast30Days} in last 30 days`}
                    />
                    <StatItem
                      icon={Clock3}
                      label="Total Time"
                      value={formatDuration(stats.totalDurationInSeconds)}
                      description={`Avg. ${formatDuration(stats.averageDurationInSeconds)}`}
                    />
                    <StatItem
                      icon={Trophy}
                      label="Current Streak"
                      value={`${stats.currentStreakDays} days`}
                      description={`Best: ${stats.longestStreakDays} days`}
                    />
                    <StatItem
                      icon={Calendar}
                      label="Active Days"
                      value={stats.activeDaysCount}
                      description="Days with at least one session"
                    />
                  </div>
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
            <Card className="flex h-full min-h-80 flex-col xl:max-h-[440px]">
              <CardHeader>
                <CardTitle>Your hobbies</CardTitle>
                <CardDescription>
                  Hobbies added to your profile, with their session counts.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto">
                {!hasHobbies ? (
                  <div className="flex h-full flex-col justify-center">
                    <EmptyState
                      icon={Shapes}
                      title="No hobbies on your profile"
                      description="Add your first hobby to start tracking the time you invest in it."
                    />
                  </div>
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

function StatItem({
  icon: Icon,
  label,
  value,
  description,
}: {
  icon: any;
  label: string;
  value: string | number;
  description: string;
}) {
  return (
    <Item variant="muted" className="rounded-xl px-4 py-4">
      <ItemMedia variant="icon">
        <Icon className="size-4" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="text-2xl font-bold tracking-tight">
          {value}
        </ItemTitle>
        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
        <ItemDescription className="mt-1 line-clamp-1">
          {description}
        </ItemDescription>
      </ItemContent>
    </Item>
  );
}

function HobbyItem({ hobby }: { hobby: GetHobbyUserByUserId200ResponseInner }) {
  return (
    <Item variant="muted" className="rounded-xl px-4 py-4">
      <ItemMedia variant="icon">
        <Shapes className="size-4 text-primary" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="font-semibold">
          {hobby.name ?? 'Unnamed hobby'}
        </ItemTitle>
        <ItemDescription className="flex items-center gap-1.5">
          <Clock3 className="size-3" />
          {hobby.sessionCount} sessions recorded
        </ItemDescription>
      </ItemContent>
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
