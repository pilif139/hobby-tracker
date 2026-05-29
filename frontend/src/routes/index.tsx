import { createFileRoute } from '@tanstack/react-router';
import Header from '@/components/header';
import { requireAuth } from '@/modules/auth/route-guards';

export const Route = createFileRoute('/')({
  beforeLoad: requireAuth,
  component: App,
});

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="mx-auto flex w-full max-w-5xl px-4 py-10">
        <section className="w-full rounded-2xl border bg-card p-6 text-center shadow-sm sm:p-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Welcome to Hobby Tracker!
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Your dashboard is ready. More profile and settings pages can plug
            into the new header dropdown next.
          </p>
        </section>
      </main>
    </div>
  );
}
