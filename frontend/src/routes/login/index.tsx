import { createFileRoute } from '@tanstack/react-router';
import LoginPage from '@/modules/auth/login/LoginPage';
import { requireGuest } from '@/modules/auth/route-guards';

export const Route = createFileRoute('/login/')({
  beforeLoad: requireGuest,
  component: LoginPage,
});
