/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imagedelivery.net",
        port: "",
        pathname: "/BgV_WlP8hqrpHlx1eQd6Xg/**",
      },
      {
        protocol: "https",
        hostname: "replicate.delivery",
        port: "",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  }
};
