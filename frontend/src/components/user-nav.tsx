import { useMemo, useState } from 'react';
import { ChevronDown, LogOut, Settings, User } from 'lucide-react';
import { authApiClient } from '@/api';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCurrentUser } from '@/modules/auth/current-user/CurrentUserContext';

function getInitials(name?: string, email?: string) {
  const source = name?.trim() || email?.trim() || 'Account';
  const parts = source.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? '';
  const second = parts[1]?.[0] ?? '';

  if (parts.length >= 2) {
    return `${first}${second}`.toUpperCase();
  }

  return source.slice(0, 2).toUpperCase();
}

export function UserNav() {
  const { currentUser, setCurrentUser } = useCurrentUser();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const displayName = currentUser?.name ?? 'Account';
  const displayEmail = currentUser?.email ?? 'Signed in';
  const initials = useMemo(
    () => getInitials(currentUser?.name, currentUser?.email),
    [currentUser?.email, currentUser?.name],
  );

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      await authApiClient.postAuthLogout();
    } catch {
      // If the session is already invalid, we still want to clear local auth state.
    } finally {
      setCurrentUser(null);
      window.location.assign('/login');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          buttonVariants({ variant: 'outline', size: 'lg' }),
          'h-10 max-w-full gap-3 px-3 sm:max-w-[280px]',
        )}
      >
        <span className="flex size-8 items-center justify-center rounded-full bg-primary/12 text-xs font-semibold text-primary">
          {initials}
        </span>
        <span className="min-w-0 text-left">
          <span className="block truncate text-sm font-medium">
            {displayName}
          </span>
          <span className="hidden truncate text-xs text-muted-foreground sm:block">
            {displayEmail}
          </span>
        </span>
        <ChevronDown className="ml-auto size-4 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="space-y-1 px-2 py-2">
          <div className="text-sm font-medium">{displayName}</div>
          <div className="text-xs text-muted-foreground">{displayEmail}</div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem disabled>
          <User className="size-4" />
          My Profile
        </DropdownMenuItem>

        <DropdownMenuItem disabled>
          <Settings className="size-4" />
          Settings
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          onClick={() => {
            void handleLogout();
          }}
          disabled={isLoggingOut}
        >
          <LogOut className="size-4" />
          {isLoggingOut ? 'Logging out…' : 'Logout'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserNav;
