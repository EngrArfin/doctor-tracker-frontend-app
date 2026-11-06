import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "images.unsplash.com",
      "discoverholidaysbd.com",
      "ozvxzsjtzdrrwejjiomf.supabase.co",
      "i.pravatar.cc",
      "example.com",
      "res.cloudinary.com",
      "img.examplecdn.com",
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Add other Next.js config options if needed
};

export default nextConfig;
