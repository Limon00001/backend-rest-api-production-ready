/**
 * Author: Monayem Hossain Limon
 * GitHub: https://github.com/Limon00001
 * Date: 06 Aug, 2025
 * @copyright 2025 monayem_hossain_limon
 */

// Internal Imports
import { logger } from '@/lib/winston';
import { User } from '@/models/User';

// Types
import type { NextFunction, Request, Response } from 'express';

// Types for Authorization Roles
export type AuthRole = 'user' | 'admin';

// Authorize Middleware
/**
 * Middleware to authorize user based on their role.
 * @param {AuthRole[]} role - Array of roles that are allowed to access the route
 */
const authorize = (role: AuthRole[]) => {
  // Return a middleware function
  return async (req: Request, res: Response, next: NextFunction) => {
    // Get user ID from request
    const userId = req.userId;

    try {
      // Find user by ID and select their role
      const user = await User.findById(userId).select('role').exec();

      // Check if user exists
      if (!user) {
        return res.status(404).json({
          code: 'NotFound',
          message: 'User not found',
        });
      }

      // Check if user's role is included in the allowed roles
      // If not, return a 403 Forbidden response
      if (!role.includes(user.role)) {
        return res.status(403).json({
          code: 'AuthorizationError',
          message:
            'Access denied. You are not authorized to perform this action.',
        });
      }

      // If user is authorized, proceed to the next middleware
      return next();
    } catch (error) {
      // Log the error for debugging purposes
      logger.error(`Error occurred while authorizing user ${userId}: ${error}`);

      return res.status(500).json({
        code: 'ServerError',
        message: 'Internal Server Error',
        error: error,
      });
    }
  };
};

// Export
export default authorize;
