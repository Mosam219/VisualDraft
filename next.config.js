/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/profile',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
