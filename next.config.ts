import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["tesseract.js"],
  outputFileTracingIncludes: {
    // The OCR worker loads its engine and dependencies in a separate thread.
    "/api/analyze/screenshot": [
      "./node_modules/tesseract.js/src/**/*",
      "./node_modules/tesseract.js-core/**/*",
      "./node_modules/wasm-feature-detect/**/*",
      "./node_modules/bmp-js/**/*",
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
          {
            key: "Content-Security-Policy",
            value:
              "frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
