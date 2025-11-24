import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [

      "subs-tracker-production.up.railway.app",
      "server-production-fa9f.up.railway.app",
      "images.ctfassets.net", // Netflix, etc.
      "cdn-icons-png.flaticon.com", // in case you use icons
      "upload.wikimedia.org", // common fallback
      "res.cloudinary.com", // if you ever use Cloudinary
      "about.x.com",
      'www.iconpacks.net',
      'blog.waalaxy.com', // 👈 add this line
      "cdn.brandfetch.io"
    ],
  },
};

export default nextConfig;
