import type { NextConfig } from "next";

const CSP = [
  "default-src 'self'",
  // Scripts: self + Next.js inline scripts (hashes preferred, using unsafe-inline for now)
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://yandex.ru https://yastatic.net",
  // Styles
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  // Fonts
  "font-src 'self' https://fonts.gstatic.com",
  // Images: self + Unsplash (placeholder photos) + Yandex
  "img-src 'self' data: blob: https://images.unsplash.com https://yandex.ru https://yastatic.net",
  // Frames: Yandex Maps + YouTube (for about page reviews)
  "frame-src https://yandex.ru https://www.youtube.com https://www.youtube-nocookie.com",
  // API / fetch destinations
  "connect-src 'self' https://api.resend.com",
  // Forms
  "form-action 'self'",
  // Base URI
  "base-uri 'self'",
  // Object embeds forbidden
  "object-src 'none'",
].join("; ");

const SECURITY_HEADERS = [
  // Anti-clickjacking
  { key: "X-Frame-Options", value: "DENY" },
  // No MIME sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // XSS filter (legacy, still useful)
  { key: "X-XSS-Protection", value: "1; mode=block" },
  // Referrer info sent only on same-origin or HTTPS→HTTPS
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disable unused browser features
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  // Content Security Policy
  { key: "Content-Security-Policy", value: CSP },
  // HSTS — enable after going live with HTTPS
  // { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apply to all routes
        source: "/:path*",
        headers: SECURITY_HEADERS,
      },
    ];
  },
};

export default nextConfig;
