import CreateHobbySessionDialog from '../components/CreateHobbySessionDialog';
import FeedList from '../components/FeedList';
import MySessionsPanel from '../components/MySessionsPanel';
import SuggestionsSidebar from '../components/SuggestionsSidebar';

export default function FeedPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Feed</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Discover hobby activity, manage sessions, and explore suggestions.
          </p>
        </div>

        <CreateHobbySessionDialog />
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <section className="space-y-6">
          <FeedList />
          <MySessionsPanel />
        </section>

        <aside>
          <SuggestionsSidebar />
        </aside>
      </div>
    </main>
  );
}
