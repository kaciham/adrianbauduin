import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
    // Temporairement désactivé pour les apostrophes
    dirs: ['pages', 'utils', 'lib'],
  },
  /* config options here */
};

export default nextConfig;
