"use client"

import { useUser, UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Settings, LogOut } from "lucide-react"
import Link from "next/link"

export function UserNav() {
  const { user, isLoaded } = useUser()

  if (!isLoaded) {
    return (
      <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
    )
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/sign-in">
          <Button variant="ghost" size="sm">
            Sign In
          </Button>
        </Link>
        <Link href="/sign-up">
          <Button size="sm">
            Sign Up
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <div className="hidden md:block text-sm">
        <p className="font-medium">{user.fullName || user.emailAddresses[0]?.emailAddress}</p>
        <p className="text-muted-foreground text-xs">
          {user.emailAddresses[0]?.emailAddress}
        </p>
      </div>
      
      <UserButton
        appearance={{
          elements: {
            avatarBox: "w-8 h-8",
            userButtonPopoverCard: "bg-card border border-border shadow-lg",
            userButtonPopoverMain: "bg-card",
            userButtonPopoverFooter: "bg-card",
            userButtonPopoverActionButton: "text-foreground hover:bg-muted",
            userButtonPopoverActionButtonText: "text-foreground",
            userButtonPopoverActionButtonIcon: "text-muted-foreground",
          }
        }}
        afterSignOutUrl="/"
      />
    </div>
  )
}