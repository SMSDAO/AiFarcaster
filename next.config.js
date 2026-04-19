/** @type {import('next').NextConfig} */
const { version } = require('./package.json');

const nextConfig = {
  reactStrictMode: true,
  // Standalone output bundles all dependencies for Docker / serverless containers.
  // On Vercel this is optional (Vercel handles bundling), but it enables
  // self-hosted Docker deployments without any extra configuration.
  output: process.env.NEXT_OUTPUT_STANDALONE === 'true' ? 'standalone' : undefined,
  env: {
    // Bake the package.json version into the build so it is available in all
    // runtimes (next start, standalone containers, etc.) via process.env.APP_VERSION.
    APP_VERSION: version,
  },
  images: {
    domains: ['localhost'],
  },
  webpack: (config) => {
    // Disable Webpack filesystem cache to avoid snapshot errors on Windows
    // and stale-cache build failures in CI.
    config.cache = false;
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      '@react-native-async-storage/async-storage': false,
    };
    config.externals.push(
      'pino-pretty',
      'encoding',
      '@grpc/grpc-js',
      'bufferutil',
      'utf-8-validate',
    );
    return config;
  },
};

module.exports = nextConfig;
