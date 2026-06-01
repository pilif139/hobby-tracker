import { createFileRoute } from '@tanstack/react-router';
import { Settings } from 'lucide-react';
import { requireAuth } from '@/modules/auth/route-guards';

export const Route = createFileRoute('/settings/')({
  beforeLoad: requireAuth,
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:py-8">
        <section className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-3">
            <Settings className="size-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Settings
            </h1>
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Manage your account preferences and application settings.
          </p>
        </section>

        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed p-12 text-center">
          <Settings className="mb-4 size-12 text-muted-foreground/50" />
          <h2 className="text-xl font-semibold">Settings are coming soon</h2>
          <p className="mt-2 text-muted-foreground">
            We're working on giving you more control over your experience.
          </p>
        </div>
      </main>
    </div>
  );
}
