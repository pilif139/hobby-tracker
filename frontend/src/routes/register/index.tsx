import { createFileRoute } from '@tanstack/react-router';
import RegisterPage from '@/modules/auth/register/RegisterPage';
import { requireGuest } from '@/modules/auth/route-guards';

export const Route = createFileRoute('/register/')({
  beforeLoad: requireGuest,
  component: RegisterPage,
});
