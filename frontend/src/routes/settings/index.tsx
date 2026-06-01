import { createFileRoute } from '@tanstack/react-router';
import { requireAuth } from '@/modules/auth/route-guards';
import SettingsPage from '@/modules/settings/SettingsPage';

export const Route = createFileRoute('/settings/')({
  beforeLoad: requireAuth,
  component: SettingsPage,
});
