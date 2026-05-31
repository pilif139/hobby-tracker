import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { PostAuthLogin200Response } from '@/api/generated/api';
import { getCurrentUser, setUnauthorizedHandler } from '@/api';

type CurrentUser = PostAuthLogin200Response;

interface CurrentUserContextValue {
  currentUser: CurrentUser | null;
  isAuthenticated: boolean;
  setCurrentUser: React.Dispatch<React.SetStateAction<CurrentUser | null>>;
}

const CurrentUserContext = createContext<CurrentUserContextValue | null>(null);

export function CurrentUserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    let cancelled = false;

    void getCurrentUser()
      .then((user) => {
        if (!cancelled) {
          setCurrentUser(user);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setCurrentUser(null);
        }
      });

    setUnauthorizedHandler((requestUrl) => {
      const isAuthPage =
        window.location.pathname.startsWith('/login') ||
        window.location.pathname.startsWith('/register');
      const isAuthRequest =
        requestUrl.includes('/auth/login') ||
        requestUrl.includes('/auth/register');
      const isCurrentUserRequest = requestUrl.includes('/auth/me');

      if (isAuthRequest || isCurrentUserRequest) {
        return;
      }

      setCurrentUser(null);

      if (!isAuthPage) {
        window.location.assign('/login');
      }
    });

    return () => {
      cancelled = true;
      setUnauthorizedHandler(null);
    };
  }, []);

  const value = useMemo<CurrentUserContextValue>(
    () => ({
      currentUser,
      isAuthenticated: Boolean(currentUser),
      setCurrentUser,
    }),
    [currentUser, setCurrentUser],
  );

  return (
    <CurrentUserContext.Provider value={value}>
      {children}
    </CurrentUserContext.Provider>
  );
}

export function useCurrentUser() {
  const ctx = useContext(CurrentUserContext);
  if (!ctx) {
    throw new Error('useCurrentUser must be used within CurrentUserProvider');
  }

  return ctx;
}
