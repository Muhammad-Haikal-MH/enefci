import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow Google user content images (e.g., business photos from Places API)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "maps.googleapis.com",
      },
    ],
  },
};

export default nextConfig;
