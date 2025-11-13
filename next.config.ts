// next.config.mjs
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    webpack: (config) => {
        config.resolve.symlinks = false;
        return config;
    },
    sassOptions: {
        includePaths: ['./src/styles'], // Point to your styles directory
        // You might remove prependData if you explicitly @use variables/mixins in each file
        // Or, if you keep it, consider if it's still needed with @use in individual files
        // For now, let's remove it if the primary goal is to use @use
        prependData: `@use "~@styles/_variables.scss" as *; @use "~@styles/_mixins.scss" as *;`,
    }
};

export default nextConfig;