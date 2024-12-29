'use client'

import { LogOut, User } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface UserMenuProps {
  email: string
  onSignOut: () => void
}

export function UserMenu({ email, onSignOut }: UserMenuProps) {
  // Get the first letter of the email for the avatar
  const initial = email?.charAt(0).toUpperCase() || '?'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-8 w-8 cursor-pointer bg-gradient-to-r from-[#B4BEFE] to-[#CBA6F7]">
          <AvatarFallback className="text-[#1E1E2E] text-sm font-medium">
            {initial}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-[#313244] border-[#45475A] text-[#CDD6F4]">
        <DropdownMenuItem className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span className="truncate">{email}</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="text-red-400 focus:text-red-400 focus:bg-red-400/10 cursor-pointer"
          onClick={onSignOut}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

