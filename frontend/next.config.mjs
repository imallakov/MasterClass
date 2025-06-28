/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        // For Next.js ≤13.1:
        domains: ["images.unsplash.com"],

        remotePatterns: [{
                protocol: "http",
                hostname: "localhost",
                port: "8000",
                pathname: "/media/**",
            },
            {
                protocol: "https",
                hostname: "https://xn--80adbfgb1coepekn6c.xn--p1ai/", // Replace with your actual production domain
                pathname: "/media/**",
            },
        ],

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