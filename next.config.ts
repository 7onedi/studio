import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
    buildActivity: true,
  },

  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp',],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 днів в секундах
    remotePatterns: [
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
      {
        protocol: "https",
        hostname: "stina.pangeya.org.ua",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ngo.pangeya.org.ua",
        pathname: "/**",
      },
      // {
      //   protocol: (process.env.UPLOADS_PROTOCOL ?? "https") as "https" | "http",
      //   hostname: process.env.UPLOADS_HOSTNAME ?? "localhost",
      //   port: process.env.UPLOADS_PORT ?? "",
      //   pathname: "/uploads/**",
      // },
    ],
  },
  webpack: (config) => {
    config.resolve.symlinks = false;
    return config;
  },
  sassOptions: {
    quietDeps: true,
    includePaths: ["./src/styles"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
