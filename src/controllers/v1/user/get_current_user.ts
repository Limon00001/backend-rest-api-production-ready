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
import type { Request, Response } from 'express';

// Get Current User Function
/** * Controller to get the current user's information.
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
const getCurrentUser = async (req: Request, res: Response) => {
  try {
    // Get user ID from request
    const userId = req.userId;

    // Check if userId is available
    // If not, return a 400 Bad Request response
    if (!userId) {
      return res.status(400).json({
        code: 'AuthenticationError',
        message: 'User ID is required to get current user information.',
      });
    }

    // Find user by ID and exclude version from the response
    // Use lean() to return a plain JavaScript object instead of a Mongoose document
    // This improves performance and reduces memory usage
    // Use select('-__v') to exclude the version key from the response
    const user = await User.findById(userId)
      .select('-__v') // Exclude version from the response
      .lean()
      .exec();

    // Check if user exists
    // If not, return a 404 Not Found response
    if (!user) {
      return res.status(404).json({
        code: 'NotFound',
        message: 'User not found',
      });
    }

    // Return the user information with a 200 OK response
    res.status(200).json({
      code: 'Success',
      user: user,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
      error: error,
    });

    // Log the error for debugging purposes
    logger.error('Error occurred while getting current user', error);
  }
};

// Export
export default getCurrentUser;
