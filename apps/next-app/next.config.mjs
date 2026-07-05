/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  webpack(config) {
    config.output.hashFunction = 'xxhash64';
    return config;
  },
};

export default nextConfig;
