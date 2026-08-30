/**
 * Prepare a reliable local dev run on Windows:
 * - free the dev port if a stale node process is listening
 * - remove stale Next cache (avoids UNKNOWN / file-lock errors)
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(new URL(".", import.meta.url)));
const projectRoot = path.resolve(root, "..");
const nextDir = path.join(projectRoot, ".next");
const cacheDistDir = path.join(projectRoot, "node_modules", ".cache", "complib-next");

/** Match `next dev --webpack -p 3000` in package.json */
const DEV_PORT = process.env.PORT || "3000";

function rmSafe(dir) {
  try {
    fs.rmSync(dir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  } catch {
    // ignore — Next will recreate
  }
}

function freePortWindows(port) {
  try {
    const out = execSync(`netstat -ano | findstr ":${port}"`, { encoding: "utf8" });
    const pids = new Set();
    for (const line of out.split(/\r?\n/)) {
      if (!line.includes("LISTENING")) continue;
      const parts = line.trim().split(/\s+/);
      const pid = parts[parts.length - 1];
      if (pid && /^\d+$/.test(pid) && pid !== "0") pids.add(pid);
    }
    for (const pid of pids) {
      try {
        execSync(`taskkill /PID ${pid} /F`, { stdio: "ignore" });
        console.log(`[prepare-dev] Freed port ${port} (stopped PID ${pid})`);
      } catch {
        // already exited
      }
    }
  } catch {
    // port not in use
  }
}

try {
  fs.rmSync(path.join(projectRoot, "tsconfig.tsbuildinfo"), { force: true });
} catch {
  // ignore
}

if (process.platform === "win32") {
  freePortWindows(DEV_PORT);
}

rmSafe(nextDir);
rmSafe(cacheDistDir);
console.log(`[prepare-dev] Cleared Next cache. Port ${DEV_PORT} ready (webpack, not Turbopack).`);

const lanUrls = [];
for (const iface of Object.values(os.networkInterfaces())) {
  if (!iface) continue;
  for (const addr of iface) {
    const isV4 = addr.family === "IPv4" || addr.family === 4;
    if (!isV4 || addr.internal) continue;
    lanUrls.push(`http://${addr.address}:${DEV_PORT}`);
  }
}
if (lanUrls.length > 0) {
  console.log(`[prepare-dev] LAN access: ${lanUrls.join(", ")}`);
}
