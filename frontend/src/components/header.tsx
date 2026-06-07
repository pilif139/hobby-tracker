import { Link } from '@tanstack/react-router';
import UserNav from '@/components/user-nav';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="min-w-0">
            <div className="truncate text-xl font-semibold tracking-tight sm:text-2xl">
              Hobby Tracker
            </div>
          </Link>

          <nav className="hidden items-center gap-1 sm:flex">
            <Link
              to="/"
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground [&.active]:bg-muted [&.active]:text-foreground"
            >
              Dashboard
            </Link>
            <Link
              to="/feed"
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground [&.active]:bg-muted [&.active]:text-foreground"
            >
              Feed
            </Link>
          </nav>
        </div>

        <UserNav />
      </div>
    </header>
  );
}
