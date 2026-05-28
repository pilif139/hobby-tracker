import { useState } from 'react';
import { Compass, LayoutList } from 'lucide-react';
import CreateHobbySessionForm from '../components/CreateHobbySessionForm';
import FeedList from '../components/FeedList';
import SuggestionsSidebar from '../components/SuggestionsSidebar';
import { cn } from '@/lib/utils';

type MobileFeedView = 'feed' | 'discover';

export default function FeedPage() {
  const [mobileView, setMobileView] = useState<MobileFeedView>('feed');

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="sticky top-14 z-30 -mx-4 mb-4 border-b bg-background/95 px-4 py-2 backdrop-blur supports-backdrop-filter:bg-background/60 sm:-mx-6 lg:hidden">
        <div
          className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1"
          role="tablist"
          aria-label="Feed view"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mobileView === 'feed'}
            className={cn(
              'flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              mobileView === 'feed'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
            onClick={() => setMobileView('feed')}
          >
            <LayoutList className="h-4 w-4" />
            Feed
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mobileView === 'discover'}
            className={cn(
              'flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              mobileView === 'discover'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
            onClick={() => setMobileView('discover')}
          >
            <Compass className="h-4 w-4" />
            Discover
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <section
          className={cn(
            'space-y-6',
            mobileView === 'discover' && 'hidden lg:block',
          )}
        >
          <div className="z-20">
            <CreateHobbySessionForm />
          </div>

          <FeedList />
        </section>

        <section
          className={cn('lg:hidden', mobileView === 'feed' && 'hidden')}
          aria-hidden={mobileView === 'feed'}
        >
          <SuggestionsSidebar />
        </section>

        <aside className="hidden lg:block">
          <div className="sticky top-22">
            <SuggestionsSidebar />
          </div>
        </aside>
      </div>
    </main>
  );
}
