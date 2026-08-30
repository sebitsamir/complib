import path from "node:path";
import type { NextConfig } from "next";
import { getAllowedDevOrigins } from "./lib/dev-origins";

const appRoot = path.resolve(process.cwd());
const monorepoRoot = path.resolve(appRoot, "..", "..");
// Avoid .next on Desktop/synced paths — reduces Windows file-lock (error 1224 / UNKNOWN).
const distDir = "node_modules/.cache/complib-next";

const nextConfig: NextConfig = {
  distDir,
  outputFileTracingRoot: monorepoRoot,
  turbopack: {
    root: monorepoRoot,
  },
  // Allow LAN IPs (e.g. http://172.23.16.1:3000) in `next dev` — Next.js 16 blocks by default.
  ...(process.env.NODE_ENV !== "production"
    ? { allowedDevOrigins: getAllowedDevOrigins() }
    : {}),
};

export default nextConfig;
