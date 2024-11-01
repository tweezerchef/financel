/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'financle.s3.us-east-2.amazonaws.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  reactStrictMode: true,
  experimental: {
    reactCompiler: true,
  },
}

export default nextConfig
