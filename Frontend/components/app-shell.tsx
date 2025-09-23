"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { TopNav } from "@/components/top-nav"
import { Sidebar } from "@/components/sidebar"
import { Footer } from "@/components/footer"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname()
  const { sidebarCollapsed } = useAppStore()

  const showSidebar = pathname.startsWith("/dashboard")
  const isAppPage =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/dashboard/profile") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/dashboard")

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopNav />

      <div className="flex flex-1">
        {showSidebar && <Sidebar />}

        <main className={cn("flex-1 flex flex-col", showSidebar && !sidebarCollapsed && "lg:ml-0")}>{children}</main>
      </div>

      {!isAppPage && <Footer />}
    </div>
  )
}
