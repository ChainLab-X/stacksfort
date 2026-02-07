import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api/stacks-node/:path*',
        destination: 'https://stacks-node-api.mainnet.stacks.co/:path*',
      },
    ];
  },
};

export default nextConfig;
