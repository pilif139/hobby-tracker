import { redirect } from '@tanstack/react-router';
import { getCurrentUser } from '@/api';

export const resolveCurrentUser = async () => {
  return getCurrentUser().catch(() => null);
};

export const requireAuth = async () => {
  const user = await resolveCurrentUser();

  if (!user) {
    throw redirect({ to: '/login' });
  }

  return { user };
};

export const requireGuest = async () => {
  const user = await resolveCurrentUser();

  if (user) {
    throw redirect({ to: '/' });
  }

  return { user: null };
};
