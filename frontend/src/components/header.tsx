import { ModeToggle } from '@/components/mode-toggle';
import { useCurrentUser } from '@/modules/auth/current-user/CurrentUserContext';

export default function Header() {
  const { currentUser } = useCurrentUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <span className="text-xl font-bold font-heading tracking-tight">
            HobbyTracker
          </span>
          {currentUser && (
            <div className="hidden h-6 w-px bg-border sm:block" />
          )}
          {currentUser && (
            <p className="hidden text-sm text-muted-foreground sm:block">
              Hello,{' '}
              <span className="font-medium text-foreground">
                {currentUser.name}
              </span>
              !
            </p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
