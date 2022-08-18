/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  images: {
    domains: ["momispappy-bucket.s3.ap-northeast-2.amazonaws.com", "looxloo.com", "localhost"],
  },
  async rewrites() {
    return [
      {
        source: "/bluedog/:path*",
        destination: `https://looxloo.com/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
