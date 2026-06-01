import { Link } from '@tanstack/react-router';
import UserNav from './user-nav';

export default function Header() {
  return (
    <header className="border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4">
        <Link to="/" className="min-w-0">
          <div className="truncate text-xl font-semibold tracking-tight sm:text-2xl">
            Hobby Tracker
          </div>
          <div className="hidden text-sm text-muted-foreground sm:block">
            Track your hobbies and sessions
          </div>
        </Link>

        <UserNav />
      </div>
    </header>
  );
}
