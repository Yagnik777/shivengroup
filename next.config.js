/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true, // enable App Router
  },
  swcMinify: true,
  output: "standalone", // easier Vercel deployment
};

module.exports = nextConfig;
