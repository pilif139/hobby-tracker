import { useLayoutEffect } from 'react';
import {
  Outlet,
  createRootRouteWithContext,
  useRouterState,
} from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { TanStackDevtools } from '@tanstack/react-devtools';

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools';

import type { QueryClient } from '@tanstack/react-query';
import { useCurrentUser } from '@/modules/auth/current-user/CurrentUserContext';
import { resolveCurrentUser } from '@/modules/auth/route-guards';
import Header from '@/components/header';

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  loader: async () => {
    const user = await resolveCurrentUser();
    return { user };
  },
  component: RootComponent,
});

function RootComponent() {
  const { setCurrentUser } = useCurrentUser();
  const { user } = Route.useLoaderData();
  const state = useRouterState();
  const isAuthPage =
    state.location.pathname.startsWith('/login') ||
    state.location.pathname.startsWith('/register');

  useLayoutEffect(() => {
    if (user) {
      setCurrentUser(user);
    }
  }, [user]);

  return (
    <>
      {!isAuthPage && <Header />}
      <Outlet />
      <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
          TanStackQueryDevtools,
        ]}
      />
    </>
  );
}
