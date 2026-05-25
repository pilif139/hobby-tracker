import CreateHobbySessionForm from '../components/CreateHobbySessionForm';
import FeedList from '../components/FeedList';
import SuggestionsSidebar from '../components/SuggestionsSidebar';
import { useCurrentUser } from '@/modules/auth/current-user/CurrentUserContext';

export default function FeedPage() {
  const { currentUser } = useCurrentUser();

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6">
        <h1 className="text-xl">
          Hello <span className="font-bold">{currentUser?.name}</span>!
        </h1>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <section className="space-y-6">
          <div className="sticky top-4 z-20">
            <CreateHobbySessionForm />
          </div>
          <FeedList />
        </section>

        <aside>
          <SuggestionsSidebar />
        </aside>
      </div>
    </main>
  );
}
