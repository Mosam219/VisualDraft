/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/home',
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'img.clerk.com', pathname: '**' }],
  },
};

module.exports = nextConfig;
