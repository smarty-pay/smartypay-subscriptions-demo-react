/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // fix a double useState call. see: https://github.com/vercel/next.js/issues/35822
}

module.exports = nextConfig
