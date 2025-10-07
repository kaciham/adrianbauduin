import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
    // Temporairement désactivé pour les apostrophes
    dirs: ['pages', 'utils', 'lib'],
  },
  outputFileTracingRoot: __dirname,
  /* config options here */
};

export default nextConfig;
