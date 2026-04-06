import { createFileRoute } from '@tanstack/react-router';
import LoginPage from '@/modules/auth/login/LoginPage';

export const Route = createFileRoute('/login/')({
  component: LoginPage,
});
