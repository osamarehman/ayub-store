import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.binayub.store",
      },
      {
        protocol: "https",
        hostname: "assets.binazeez.com", // Fallback during DNS propagation
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // Standalone output for VPS deployment
  output: "standalone",

  // Enable experimental features
  experimental: {
    // Enable server actions
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
