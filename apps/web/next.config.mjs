/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Transpile the workspace package so its raw TS is compiled by Next.
  transpilePackages: ["@quiz/shared"],
};

export default nextConfig;
