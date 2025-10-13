/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { appDir: true },
  swcMinify: true,
  output: "standalone",
};

module.exports = nextConfig;
