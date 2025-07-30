/**
 * Author: Monayem Hossain Limon
 * GitHub: https://github.com/Limon00001
 * Date: 30 Jul, 2025
 * @copyright 2025 monayem_hossain_limon
 */

// External Imports
import dotenv from 'dotenv';

// Environment Variables
dotenv.config();

// Config Object
const config = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  WHITELIST_ORIGINS: [process.env.WHITELIST_ORIGINS],
  MONGO_URI: process.env.MONGO_URI,
};

// Export
export default config;
