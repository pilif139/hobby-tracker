import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { Toaster } from 'sonner';

import * as TanStackQueryProvider from './integrations/tanstack-query/root-provider.tsx';

// Import the generated route tree
import { routeTree } from './routeTree.gen';
import { CurrentUserProvider } from './modules/auth/current-user/CurrentUserContext';
import { ThemeProvider } from './integrations/theme/theme-provider';

import './styles.css';
import reportWebVitals from './reportWebVitals.ts';

// Create a new router instance
const TanStackQueryProviderContext = TanStackQueryProvider.getContext();

const router = createRouter({
  routeTree,
  context: {
    ...TanStackQueryProviderContext,
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  // eslint-disable-next-line no-unused-vars
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById('app');

if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <ThemeProvider defaultTheme="dark" storageKey="hobby-tracker-theme">
        <CurrentUserProvider>
          <TanStackQueryProvider.Provider {...TanStackQueryProviderContext}>
            <RouterProvider router={router} />
            <Toaster position="top-right" richColors closeButton />
          </TanStackQueryProvider.Provider>
        </CurrentUserProvider>
      </ThemeProvider>
    </StrictMode>,
  );
}

reportWebVitals();
