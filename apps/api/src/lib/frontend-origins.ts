import os from "node:os";

function isIPv4Address(family: string | number): boolean {
  return family === "IPv4" || family === 4;
}

function getLanFrontendOrigins(port = "3000"): string[] {
  const hosts = new Set<string>();
  for (const iface of Object.values(os.networkInterfaces())) {
    if (!iface) continue;
    for (const addr of iface) {
      if (!isIPv4Address(addr.family) || addr.internal) continue;
      hosts.add(`http://${addr.address}:${port}`);
    }
  }
  return [...hosts];
}

export function getAllowedFrontendOrigins(): string[] {
  const raw =
    process.env.FRONTEND_URLS?.trim() ||
    process.env.FRONTEND_URL?.trim() ||
    "http://localhost:3000";

  const configured = raw
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (process.env.NODE_ENV === "production") {
    return configured;
  }

  const port = process.env.FRONTEND_PORT ?? "3000";
  const devDefaults = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    ...getLanFrontendOrigins(port),
  ];

  return [...new Set([...configured, ...devDefaults])];
}

export function isAllowedFrontendOrigin(origin: string | undefined): boolean {
  if (!origin) return true;
  return getAllowedFrontendOrigins().includes(origin);
}
