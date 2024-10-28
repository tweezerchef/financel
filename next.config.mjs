/** @type {import('next').NextConfig} */
const nextConfig = {
  // change when docker for container for target
  // target: '??',
  images: {
    domains: [
      'localhost',
      's3.amazonaws.com',
      'financle.s3.us-east-2.amazonaws.com',
    ],
  },
  reactStrictMode: true,
  experimental: {
    reactCompiler: true,
  },
}

export default nextConfig
