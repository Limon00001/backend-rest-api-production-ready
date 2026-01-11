/**
 * Author: Monayem Hossain Limon
 * GitHub: https://github.com/Limon00001
 * Date: 04 Aug, 2025
 * @copyright 2025 monayem_hossain_limon
 */

// External Imports
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

// Internal Imports
import { verifyAccessToken } from '@/lib/jwt';
import { logger } from '@/lib/winston';

// Types
import type { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';

/**
 * @function authenticate
 * @description Middleware to authenticate user requests.
 * This middleware checks if the user is authenticated by verifying the JWT token.
 * If the token is valid, it allows the request to proceed to the next middleware or route handler.
 * If the token is invalid or missing, it returns a 401 Unauthorized response.
 * @param {Request} req - Express request object. Expects a JWT Bearer token in the Authorization header.
 * @param {Response} res - Express response object. Returns a 401 Unauthorized response if the token is invalid (Authentication failed).
 * @param {NextFunction} next - Express next middleware function. Called to pass control to the next middleware or route handler.
 */

// Middleware to authenticate user requests
const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  // If there is no Authorization header or it does not start with 'Bearer ', return a 401 Unauthorized response
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      code: 'AuthenticationError',
      message: 'Access Denied: No token provided.',
    });
  }

  // Extract the token from the Authorization header
  const [_, token] = authHeader.split(' '); // or, const token = authHeader.split(' ')[1];

  try {
    // Verify the token and extract user information from the payload
    const jwtPayload = verifyAccessToken(token) as { userId: Types.ObjectId };

    // If the token is valid, attach the userId to the request object for further processing
    req.userId = jwtPayload.userId;

    // Proceed to the next middleware or route handler
    return next();
  } catch (error) {
    // Handle expired token error
    if (error instanceof TokenExpiredError) {
      // If the token has expired, return a 401 Unauthorized response
      return res.status(401).json({
        code: 'AuthenticationError',
        message: 'Access token has expired. Request a new token.',
      });
    }

    // Handle invalid token error
    if (error instanceof JsonWebTokenError) {
      // If the token is invalid, return a 401 Unauthorized response
      return res.status(401).json({
        code: 'AuthenticationError',
        message: 'Invalid token. Please provide a valid token.',
      });
    }

    // Handle other errors
    res.status(500).json({
      code: 'ServerError',
      message: 'An unexpected error occurred. Please try again later.',
      error: error,
    });

    logger.error('Error occurred during authentication', error);
  }
};

// Export
export default authenticate;
