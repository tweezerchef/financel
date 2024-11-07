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
        hostname: `${process.env.NEXT_PUBLIC_SERVER_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_SERVER_AWS_REGION}.amazonaws.com`,
        pathname: '/chart/**',
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
