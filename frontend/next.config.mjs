/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // For Next.js ≤13.1:
    domains: ["images.unsplash.com"],

    // If you’re on Next.js 13.2+ and want more granular control, you can use:
    // remotePatterns: [{
    //     protocol: "https",
    //     hostname: "images.unsplash.com",
    //     port: "",
    //     pathname: "/**",
    // }, ],
  },
};

export default nextConfig;
