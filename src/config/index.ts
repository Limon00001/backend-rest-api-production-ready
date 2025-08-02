/**
 * Author: Monayem Hossain Limon
 * GitHub: https://github.com/Limon00001
 * Date: 30 Jul, 2025
 * @copyright 2025 monayem_hossain_limon
 */

// External Imports
import dotenv from 'dotenv';

import type ms from 'ms';

// Environment Variables
dotenv.config();

// Config Object
const config = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  WHITELIST_ORIGINS: [process.env.WHITELIST_ORIGINS],
  MONGO_URI: process.env.MONGO_URI,
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY as ms.StringValue,
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY as ms.StringValue,
  WHITELIST_ADMINS_MAIL: [
    process.env.WHITELIST_ADMINS_MAIL_1,
    process.env.WHITELIST_ADMINS_MAIL_2,
  ],
};

// Export
export default config;
