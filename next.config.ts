import type { NextConfig } from "next";

/**
 * GitHub Pages serves a project site from /<repo>, so the build needs a base path.
 * It is read from the environment rather than hardcoded, which keeps `npm run dev`
 * and any root-domain deploy working without changes.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Every route is prerenderable, so the whole site ships as static files.
  output: "export",
  // Emits collections/index.html rather than collections.html, which static hosts
  // resolve more reliably.
  trailingSlash: true,
  basePath,
};

export default nextConfig;
