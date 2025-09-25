/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { 
    ignoreBuildErrors: true
  },
  eslint: { ignoreDuringBuilds: true },
  experimental: {
    typedRoutes: false
  },
  output: undefined, // Disable static export
  trailingSlash: false
}

module.exports = nextConfig
