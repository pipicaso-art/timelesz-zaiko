/** @type {import('next').NextConfig} */
const { withNextOnPages } = require('@cloudflare/next-on-pages/next-dev');

const nextConfig = {
  reactStrictMode: true,
};

module.exports = process.env.CF_PAGES ? withNextOnPages(nextConfig) : nextConfig;
