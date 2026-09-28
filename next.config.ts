import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Lets you open the dev server from your phone on the same Wi-Fi
  // using your PC's network address (e.g. http://10.10.0.212:3000).
  allowedDevOrigins: ["10.10.0.212"],
};

export default nextConfig;
