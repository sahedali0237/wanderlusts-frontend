import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  // Tailwind v4 is compiled by PostCSS (see postcss.config.mjs) instead of the
  // Turbopack loader, because the scripts run `--webpack` on this machine.
};

export default nextConfig;
