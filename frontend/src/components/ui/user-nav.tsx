import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function UserNav() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <span className="cursor-pointer">User</span>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuItem>Mój profil</DropdownMenuItem>
        <DropdownMenuItem>Ustawienia</DropdownMenuItem>
        <DropdownMenuItem className="text-red-500">
          Wyloguj
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}