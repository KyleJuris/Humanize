"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAppStore } from "@/lib/store"
import { api } from "@/lib/api"
import { Menu, X, User } from "lucide-react"
import { cn } from "@/lib/utils"

export function TopNav() {
  const pathname = usePathname()
  const { isAuthenticated, user, toggleSidebar } = useAppStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { href: "/dashboard/humanizer", label: "Humanizer" },
    { href: "/blog", label: "Blog" },
    { href: "/pricing", label: "Pricing" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full flex h-16 items-center justify-between px-4">
        {/* Left side - Logo and hamburger */}
        <div className="flex items-center gap-4">
          {pathname.startsWith("/humanizer") && (
            <Button variant="ghost" size="sm" onClick={toggleSidebar} className="lg:hidden">
              <Menu className="h-4 w-4" />
            </Button>
          )}

          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-700 text-white font-bold text-sm">
              HP
            </div>
            <span className="font-bold text-xl text-slate-900">HumanizePro</span>
          </Link>
        </div>

        {/* Center - Navigation (desktop) */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {navItems.map((item) => (
              <NavigationMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
                      pathname === item.href && "bg-accent text-accent-foreground",
                    )}
                  >
                    {item.label}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link href="/dashboard/profile">
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{user?.name}</span>
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  try {
                    console.log('Starting logout process...')
                    
                    // Sign out from Supabase
                    await api.logout()
                    
                    // Clear all user data from store
                    const store = useAppStore.getState()
                    store.setUser(null)
                    store.setAuthenticated(false)
                    store.setProjects([])
                    store.setCurrentProject(null)
                    
                    console.log('Logout successful, redirecting...')
                    
                    // Redirect to auth page
                    window.location.href = '/auth'
                  } catch (error) {
                    console.error('Logout failed:', error)
                    // Even if logout fails, clear local state and redirect
                    const store = useAppStore.getState()
                    store.setUser(null)
                    store.setAuthenticated(false)
                    store.setProjects([])
                    store.setCurrentProject(null)
                    window.location.href = '/auth'
                  }
                }}
              >
                Sign out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/auth">
                <Button size="sm">Try for free</Button>
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="w-full px-4 py-4">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                    pathname === item.href && "bg-accent text-accent-foreground",
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
