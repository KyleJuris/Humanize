"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User } from "lucide-react"

interface BlogPost {
  id: string
  title: string
  excerpt: string
  date: string
  author: string
  category: string
  readTime: string
  image: string
}

interface BlogCardProps {
  post: BlogPost
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video relative overflow-hidden">
        <Image
          src={post.image || "/placeholder.svg"}
          alt={post.title}
          fill
          className="object-cover hover:scale-105 transition-transform"
        />
      </div>

      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="secondary">{post.category}</Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{post.readTime}</span>
          </div>
        </div>

        <h3 className="text-xl font-bold mb-3 line-clamp-2 hover:text-primary transition-colors">
          <Link href={`/blog/${post.id}`}>{post.title}</Link>
        </h3>

        <p className="text-muted-foreground text-sm line-clamp-3 mb-4">{post.excerpt}</p>
      </CardContent>

      <CardFooter className="px-6 py-4 border-t border-border">
        <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{new Date(post.date).toLocaleDateString()}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
