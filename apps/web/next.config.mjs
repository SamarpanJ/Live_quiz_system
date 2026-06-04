/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Transpile the workspace package so its raw TS is compiled by Next.
  transpilePackages: ["@quiz/shared"],
  // Lower peak RAM during `next build` (helps Render free-tier builders).
  experimental: {
    webpackMemoryOptimizations: true,
  },
};

export default nextConfig;
