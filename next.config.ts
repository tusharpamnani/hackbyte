/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Allows images from all domains
      },
      {
        protocol: "http",
        hostname: "**", // Allows images from all domains (including HTTP)
      },
    ],
  }
};

export default nextConfig;
