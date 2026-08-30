/**
 * Regenerates React/Vue/vanilla bundles from /components using the TypeScript codegen.
 * Run: npm run generate:components
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, "..");

const result = spawnSync(
  "npx",
  ["tsx", path.join(repoRoot, "scripts", "generate-components.ts")],
  { cwd: repoRoot, stdio: "inherit", shell: true },
);

process.exit(result.status ?? 1);
