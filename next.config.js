/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,         // Recommended
    swcMinify: true,               // Faster builds
    experimental: {
      appDir: true,                // Enable App Router
    },
    eslint: {
      ignoreDuringBuilds: true,   // Avoid ESLint breaking build on Vercel
    },
    typescript: {
      ignoreBuildErrors: true,     // Optional: avoids build fail on TS errors
    },
    output: 'standalone',           // Makes Vercel deployment easier
  };
  
  module.exports = nextConfig;
  