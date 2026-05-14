import path from "path";
import type { NextConfig } from "next";

/** Where Next should forward `/console-socket/socket.io/*` (Engine.IO). Default: API on this machine. */
const consoleApiInternal =
  process.env.CONSOLE_API_INTERNAL?.replace(/\/+$/, "") || "http://127.0.0.1:4000";

/** Patterns for `Origin` hostnames so HMR (`/_next/webpack-hmr`) works over LAN (Next 15+ blocks by default). */
function privateLanAllowedDevOrigins(): string[] {
  const out = ["192.168.*.*", "10.*.*.*"];
  for (let i = 16; i <= 31; i += 1) {
    out.push(`172.${i}.*.*`);
  }
  return out;
}

const extraAllowedDevOrigins = (process.env.NEXT_ALLOWED_DEV_ORIGINS ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const nextConfig: NextConfig = {
  turbopack: {
    // Monorepo: repo root and apps/web both have package-lock.json — pin Turbopack to this app (absolute path).
    root: path.resolve(__dirname),
  },
  allowedDevOrigins: [...extraAllowedDevOrigins, ...privateLanAllowedDevOrigins(), "host.docker.internal"],
  async rewrites() {
    return [
      {
        source: "/console-socket/socket.io/:path*",
        destination: `${consoleApiInternal}/socket.io/:path*`,
      },
    ];
  },
};

export default nextConfig;
