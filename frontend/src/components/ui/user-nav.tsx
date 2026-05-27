"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useCurrentUser } from "@/hooks/use-current-user"
import { useRouter } from "next/navigation"
import { authApiClient } from "@/lib/api"

export function UserNav() {
  const user = useCurrentUser()
  const router = useRouter()

  const handleLogout = async () => {
    await authApiClient.postAuthLogout()
    router.push("/login")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <span className="cursor-pointer font-medium">
          {user?.name ?? "User"}
        </span>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuItem>Mój profil</DropdownMenuItem>
        <DropdownMenuItem>Ustawienia</DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-red-500"
        >
          Wyloguj
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}