/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains:
      typeof process.env.CLOUDFRONT_DISTRIBUTION_DOMAIN === "string"
        ? [process.env.CLOUDFRONT_DISTRIBUTION_DOMAIN]
        : undefined,
  },
}

module.exports = nextConfig
