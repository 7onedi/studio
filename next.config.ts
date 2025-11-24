import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "stina.pangeya.org.ua",
      "ngo.pangeya.org.ua",
    ],
  },
  webpack: (config) => {
    config.resolve.symlinks = false;
    return config;
  },
  sassOptions: {
    quietDeps: true, // ігнорує warnings з SCSS
    includePaths: ['./src/styles'], // Point to your styles directory
    // prependData: `@use "~@styles/_variables.scss" as *; @use "~@styles/_mixins.scss" as *;`,

    // prependData прибираємо, якщо @use є у кожному файлі
  },
  eslint: {
    ignoreDuringBuilds: true, // дозволяє build навіть з ESLint помилками
  },
};

export default nextConfig;
