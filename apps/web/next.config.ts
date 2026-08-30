import path from "node:path";
import type { NextConfig } from "next";
import { getAllowedDevOrigins } from "./lib/dev-origins";

const appRoot = path.resolve(process.cwd());
const monorepoRoot = path.resolve(appRoot, "..", "..");

const nextConfig: NextConfig = {
  outputFileTracingRoot: monorepoRoot,
  transpilePackages: [
    "@complib/contracts",
    "@complib/taxonomy",
    "@complib/entitlements",
    "@complib/component-schema",
    "@complib/variant-engine",
    "@complib/export-engine",
  ],
  turbopack: {
    root: monorepoRoot,
  },
  ...(process.env.NODE_ENV !== "production"
    ? { allowedDevOrigins: getAllowedDevOrigins() }
    : {}),
};

export default nextConfig;