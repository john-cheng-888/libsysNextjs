import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
 serverExternalPackages: ['knex', 'pg', 'jsonwebtoken', 
  'bcryptjs','svg-captcha','winston','winston-daily-rotate-file',
  'jsonwebtoken'],
};

export default nextConfig;
