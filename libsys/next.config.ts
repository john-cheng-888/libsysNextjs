import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
 serverExternalPackages: ['knex', 'pg', 'jsonwebtoken', 'bcryptjs','svg-captcha'],
};

export default nextConfig;
