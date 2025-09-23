import { BlogCard } from "@/components/blog-card"

export default function BlogPage() {
  // Mock blog posts data
  const posts = [
    {
      id: "1",
      title: "The Future of AI Text Humanization",
      excerpt:
        "Explore how AI text humanization is evolving and what it means for content creators, marketers, and writers in 2024.",
      date: "2024-01-15",
      author: "Sarah Johnson",
      category: "Technology",
      readTime: "5 min read",
      image: "/ai-futuristic-city.png",
    },
    {
      id: "2",
      title: "Best Practices for Humanizing AI Content",
      excerpt:
        "Learn the essential techniques and strategies for making AI-generated content sound natural and engaging.",
      date: "2024-01-10",
      author: "Mike Chen",
      category: "Guide",
      readTime: "8 min read",
      image: "/writing-content-creation.jpg",
    },
    {
      id: "3",
      title: "Understanding AI Detection Tools",
      excerpt:
        "A comprehensive guide to how AI detection tools work and how to create content that passes their scrutiny.",
      date: "2024-01-05",
      author: "Emily Rodriguez",
      category: "Education",
      readTime: "6 min read",
      image: "/ai-detection-analysis.jpg",
    },
    {
      id: "4",
      title: "Content Marketing in the AI Era",
      excerpt: "How AI tools are transforming content marketing and what strategies work best in this new landscape.",
      date: "2023-12-28",
      author: "David Park",
      category: "Marketing",
      readTime: "7 min read",
      image: "/content-marketing-strategy.png",
    },
    {
      id: "5",
      title: "The Ethics of AI Text Humanization",
      excerpt:
        "Discussing the ethical considerations and responsible use of AI text humanization tools in various contexts.",
      date: "2023-12-20",
      author: "Dr. Lisa Thompson",
      category: "Ethics",
      readTime: "10 min read",
      image: "/ethics-ai-responsibility.jpg",
    },
    {
      id: "6",
      title: "Improving Your Writing with AI Assistance",
      excerpt:
        "Tips and techniques for using AI tools to enhance your writing while maintaining your unique voice and style.",
      date: "2023-12-15",
      author: "Alex Morgan",
      category: "Writing",
      readTime: "4 min read",
      image: "/writing-improvement-ai.jpg",
    },
  ]

  const categories = ["All", "Technology", "Guide", "Education", "Marketing", "Ethics", "Writing"]

  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-green-100 to-green-50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-slate-900">
              HumanizePro <span className="text-green-600">Blog</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8">
              Insights, tips, and best practices for AI text humanization and content creation.
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                className="px-4 py-2 rounded-full text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Load More Posts
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
