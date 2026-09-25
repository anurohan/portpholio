/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compiler: {
    // Strip console.* in production except errors/warnings.
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },
  // three / R3F ship untranspiled ESM in places; transpile for safety across Node versions.
  transpilePackages: ["three"],
  experimental: {
    optimizePackageImports: ["framer-motion"],
  },
};

export default nextConfig;
