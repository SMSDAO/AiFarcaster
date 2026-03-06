/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
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
