import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Rss,
  Settings,
} from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { toast } from 'sonner';
import { authApiClient } from '@/api';
import { ModeToggle } from '@/components/mode-toggle';
import { buttonVariants } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useCurrentUser } from '@/modules/auth/current-user/CurrentUserContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function UserNav() {
  const { currentUser, setCurrentUser } = useCurrentUser();

  const handleLogout = async () => {
    try {
      await authApiClient.postAuthLogout({
        headers: { 'x-toast-suppressed': '1' },
      });
      toast.success('Signed out');
    } catch (e: any) {
      toast.error(e?.message ?? 'Sign out failed');
    } finally {
      setCurrentUser(null);
      window.location.assign('/login');
    }
  };

  const userInitials = currentUser?.name
    ? currentUser.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : (currentUser?.email[0] ?? 'A').toUpperCase();

  return (
    <div className="flex items-center gap-2">
      <ModeToggle />
      <DropdownMenu>
        <DropdownMenuTrigger
          className={buttonVariants({
            variant: 'outline',
            className: 'h-8 max-w-full gap-2 px-2 sm:max-w-70',
          })}
        >
          <Avatar size="sm" className="size-5">
            <AvatarImage src={currentUser?.avatarUrl ?? undefined} />
            <AvatarFallback className="text-[10px]">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <span className="min-w-0 truncate text-sm font-medium">
            {currentUser?.name ?? currentUser?.email ?? 'Account'}
          </span>
          <ChevronDown className="size-4 text-muted-foreground" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-64">
          <div className="flex items-center gap-3 border-b px-3 py-2">
            <Avatar>
              <AvatarImage src={currentUser?.avatarUrl ?? undefined} />
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">
                {currentUser?.name ?? 'Account'}
              </div>
              <div className="truncate text-xs text-muted-foreground">
                {currentUser?.email ?? 'Signed in'}
              </div>
            </div>
          </div>

          <div className="p-1">
            <Link to="/">
              <DropdownMenuItem className="cursor-pointer gap-2 rounded-sm">
                <LayoutDashboard className="size-4 text-muted-foreground" />
                <span>Dashboard</span>
              </DropdownMenuItem>
            </Link>
            <Link to="/feed">
              <DropdownMenuItem className="cursor-pointer gap-2 rounded-sm">
                <Rss className="size-4 text-muted-foreground" />
                <span>Feed</span>
              </DropdownMenuItem>
            </Link>
            <Link to="/settings">
              <DropdownMenuItem className="cursor-pointer gap-2 rounded-sm">
                <Settings className="size-4 text-muted-foreground" />
                <span>Settings</span>
              </DropdownMenuItem>
            </Link>
          </div>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className={cn(
              buttonVariants({ variant: 'ghost' }),
              'h-auto w-full justify-start rounded-sm px-2 py-1.5 font-normal text-destructive hover:bg-destructive/10 hover:text-destructive',
            )}
            onSelect={() => {
              void handleLogout();
            }}
          >
            <LogOut className="mr-2 size-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
