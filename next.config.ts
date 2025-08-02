/** @type {import('next').NextConfig} */
const nextConfig = {
  // This will allow dots `.` and other chars in URL
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  trailingSlash: false,
  reactStrictMode: true,
};

module.exports = nextConfig;
