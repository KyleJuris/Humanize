"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { List } from "lucide-react"

interface TocItem {
  id: string
  title: string
}

interface TocSidebarProps {
  items: TocItem[]
}

export function TocSidebar({ items }: TocSidebarProps) {
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: "-20% 0% -35% 0%" },
    )

    items.forEach((item) => {
      const element = document.getElementById(item.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [items])

  return (
    <div className="sticky top-24">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <List className="h-4 w-4" />
            Table of Contents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <nav className="space-y-2">
            {items.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`block text-sm py-1 px-2 rounded transition-colors ${
                  activeId === item.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                {item.title}
              </a>
            ))}
          </nav>
        </CardContent>
      </Card>
    </div>
  )
}
