import os from "node:os";

function isIPv4Address(family: string | number): boolean {
  return family === "IPv4" || family === 4;
}

/** Non-loopback IPv4 addresses on this machine (e.g. 172.23.16.1 for LAN access). */
export function getLanIPv4Hosts(): string[] {
  const hosts = new Set<string>();
  for (const iface of Object.values(os.networkInterfaces())) {
    if (!iface) continue;
    for (const addr of iface) {
      if (!isIPv4Address(addr.family) || addr.internal) continue;
      hosts.add(addr.address);
    }
  }
  return [...hosts];
}

/** Origins allowed to load Next.js dev assets when not using localhost. */
export function getAllowedDevOrigins(): string[] {
  const fromEnv = (process.env.COMPLIB_ALLOWED_DEV_ORIGINS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  return ["localhost", "127.0.0.1", "*.localhost", ...getLanIPv4Hosts(), ...fromEnv];
}

export function formatDevAccessUrls(port = process.env.PORT ?? "3000"): string[] {
  const urls = [`http://localhost:${port}`];
  for (const host of getLanIPv4Hosts()) {
    urls.push(`http://${host}:${port}`);
  }
  return urls;
}
