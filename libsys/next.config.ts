import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
 serverExternalPackages: ['knex', 'pg', 'jsonwebtoken', 'bcryptjs'],
};

export default nextConfig;
