import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
    buildActivity: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "/vi/**",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com", // ✅ ДОДАНО (критично)
        pathname: "/vi/**",
      },
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
