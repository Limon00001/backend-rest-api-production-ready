/**
 * Author: Monayem Hossain Limon
 * GitHub: https://github.com/Limon00001
 * Date: 02 Aug, 2025
 * @copyright 2025 monayem_hossain_limon
 */

// Internal Imports
import { generateAccessToken, verifyRefreshToken } from '@/lib/jwt';
import { logger } from '@/lib/winston';
import Token from '@/models/Token';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

// Types
import type { Request, Response } from 'express';
import { Types } from 'mongoose';

const refreshToken = async (req: Request, res: Response) => {
  // Extract the refresh token from cookies
  const refreshToken = req.cookies.refreshToken as string;

  try {
    // If the refresh token exists in the database
    const tokenExists = await Token.exists({ token: refreshToken });

    // If the refresh token does not exist in the database, return an error
    if (!tokenExists) {
      return res.status(401).json({
        code: 'AuthorizationError',
        message: 'Invalid refresh token',
      });
    }

    // Verify the refresh token
    const jwtPayload = verifyRefreshToken(refreshToken) as {
      userId: Types.ObjectId;
    };

    // If the JWT payload is invalid, return an error
    if (!jwtPayload || !jwtPayload.userId) {
      return res.status(401).json({
        code: 'AuthorizationError',
        message: 'Invalid refresh token',
      });
    }

    // Generate a new access token
    const accessToken = generateAccessToken(jwtPayload.userId);

    // Respond with the new access token
    res.status(200).json({
      accessToken,
    });
  } catch (error) {
    // Handle different types of errors
    // If the error is a TokenExpiredError or JsonWebTokenError, return an error message
    if (error instanceof TokenExpiredError) {
      return res.status(401).json({
        code: 'AuthorizationError',
        message: 'Refresh token expired, please log in again',
      });
    }

    if (error instanceof JsonWebTokenError) {
      return res.status(401).json({
        code: 'AuthorizationError',
        message: 'Invalid refresh token',
      });
    }

    // For any other errors, log the error and return a generic server error response
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: error,
    });

    logger.error('Error refreshing token', error);
  }
};

// Export
export default refreshToken;
