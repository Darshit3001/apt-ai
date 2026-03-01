import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for serverless deployment
  serverExternalPackages: ["better-sqlite3"],

  // Image optimization
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },

  // Headers for security
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
