/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { 
    ignoreBuildErrors: true
  },
  eslint: { ignoreDuringBuilds: true },
  trailingSlash: false,
  output: 'standalone'
}

module.exports = nextConfig
