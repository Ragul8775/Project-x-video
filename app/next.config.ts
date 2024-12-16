import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "ipfs.io" },
      { hostname: "gateway.pinata.cloud" },
    ],
  },
};

export default nextConfig;
