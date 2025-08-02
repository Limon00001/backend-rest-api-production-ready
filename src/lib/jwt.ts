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

const generateRefreshToken = (userId: Types.ObjectId): string => {
  // Validate userId
  if (!userId) {
    throw new Error('User ID is required to generate a refresh token.');
  }

  // Check if JWT secret is set
  if (
    !config.JWT_REFRESH_SECRET ||
    typeof config.JWT_REFRESH_SECRET !== 'string'
  ) {
    throw new Error('JWT refresh secret is not set or is not a string.');
  }
  if (typeof config.REFRESH_TOKEN_EXPIRY !== 'string') {
    throw new Error('Refresh token expiry must be a string.');
  }

  // Generate Refresh Token
  return jwt.sign({ userId }, config.JWT_REFRESH_SECRET, {
    expiresIn: config.REFRESH_TOKEN_EXPIRY,
    subject: 'refreshToken',
  });
};

const verifyAccessToken = (token: string) => {
  return jwt.verify(token, config.JWT_ACCESS_SECRET as string);
};

const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, config.JWT_REFRESH_SECRET as string);
};

// Export
export {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
