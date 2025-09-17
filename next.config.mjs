/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { dev }) => {
    // Suppress case sensitivity warnings on Windows
    if (dev) {
      config.infrastructureLogging = {
        level: 'error',
      }
    }
    return config
  },
}

export default nextConfig
