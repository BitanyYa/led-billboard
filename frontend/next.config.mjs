/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        // Supabase Storage (project-specific bucket URLs)
        protocol: "https",
        hostname: "qmjzkoekgyvdwumuvnsd.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        // Supabase CDN transform URLs
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/render/**",
      },
    ],
  },
};

export default nextConfig;
