/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'photostore2.s3.eu-central-1.amazonaws.com',
            port: '',
            pathname: '/**',
          },
        ],
      },
}

module.exports = nextConfig
