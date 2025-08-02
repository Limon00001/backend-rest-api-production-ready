/**
 * Author: Monayem Hossain Limon
 * GitHub: https://github.com/Limon00001
 * Date: 01 Aug, 2025
 * @copyright 2025 monayem_hossain_limon
 */

// External Imports
import jwt from 'jsonwebtoken';

// Internal Imports
import config from '@/config';

// Types
import { Types } from 'mongoose';

const generateAccessToken = (userId: Types.ObjectId): string => {
  // Validate userId
  if (!userId) {
    throw new Error('User ID is required to generate an access token.');
  }

  // Check if JWT secret is set
  if (
    !config.JWT_ACCESS_SECRET ||
    typeof config.JWT_ACCESS_SECRET !== 'string'
  ) {
    throw new Error('JWT access secret is not set or is not a string.');
  }
  if (typeof config.ACCESS_TOKEN_EXPIRY !== 'string') {
    throw new Error('Access token expiry must be a string.');
  }

  // Generate Access Token
  return jwt.sign({ userId }, config.JWT_ACCESS_SECRET, {
    expiresIn: config.ACCESS_TOKEN_EXPIRY,
    subject: 'accessApi',
  });
};

// Export
export { generateAccessToken };
