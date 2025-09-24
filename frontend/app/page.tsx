export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        Welcome to Humanize Pro
      </h1>
      <p className="text-lg text-center mb-8">
        A professional humanization platform
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Features</h2>
          <p className="text-gray-600">Discover powerful humanization features and capabilities.</p>
        </div>
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Learn</h2>
          <p className="text-gray-600">Learn how to effectively use our humanization tools.</p>
        </div>
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Templates</h2>
          <p className="text-gray-600">Explore pre-built templates for common use cases.</p>
        </div>
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Deploy</h2>
          <p className="text-gray-600">Instantly deploy your humanized content with Vercel.</p>
        </div>
      </div>
    </div>
  )
}
