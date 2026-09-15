import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // dev only: lets phones on the LAN (http://192.168.x.x:3001) load dev resources and hydrate
  allowedDevOrigins: ["192.168.*.*"],
};

export default nextConfig;
