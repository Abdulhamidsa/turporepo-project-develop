import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  webpack(config) {
    config.output.hashFunction = 'xxhash64';
    return config;
  },
};

export default nextConfig;
