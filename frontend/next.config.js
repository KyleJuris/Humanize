/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { 
    ignoreBuildErrors: true
  },
  eslint: { ignoreDuringBuilds: true },
  trailingSlash: false,
  output: 'standalone',
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ignored: [
          '**/node_modules/**',
          '**/.git/**',
          '**/DumpStack.log.tmp',
          '**/pagefile.sys',
          '**/hiberfil.sys',
          '**/swapfile.sys',
          '**/System Volume Information/**',
          '**/Windows/**'
        ]
      }
    }
    return config
  }
}

module.exports = nextConfig
