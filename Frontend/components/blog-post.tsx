"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User, Share2, Bookmark } from "lucide-react"

interface BlogPostProps {
  post: {
    id: string
    title: string
    excerpt: string
    date: string
    author: string
    category: string
    readTime: string
    image: string
    content: string
  }
}

export function BlogPost({ post }: BlogPostProps) {
  return (
    <article className="max-w-none">
      {/* Header */}
      <header className="mb-8">
        <div className="aspect-video relative overflow-hidden rounded-lg mb-6">
          <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
        </div>

        <div className="flex items-center gap-2 mb-4">
          <Badge variant="secondary">{post.category}</Badge>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(post.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-4 text-balance">{post.title}</h1>
        <p className="text-xl text-muted-foreground text-balance">{post.excerpt}</p>

        <div className="flex items-center gap-2 mt-6">
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Bookmark className="h-4 w-4" />
            Save
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="prose prose-lg max-w-none dark:prose-invert">
        <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, "<br />") }} />
      </div>
    </article>
  )
}
