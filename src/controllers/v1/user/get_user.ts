/**
 * Author: Monayem Hossain Limon
 * GitHub: https://github.com/Limon00001
 * Date: 09 Aug, 2025
 * @copyright 2025 monayem_hossain_limon
 */

// Internal Imports
import { logger } from '@/lib/winston';
import { User } from '@/models/User';

// Types
import type { Request, Response } from 'express';

// Controller Function to get all users
/** * Controller to get all users.
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
const getUser = async (req: Request, res: Response) => {
  try {
    // Get user ID from request
    const { userId } = req.params;

    // Find user by ID
    const user = await User.findById(userId).select('-__v').exec();

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        code: 'NotFound',
        message: 'User not found',
      });
    }

    // Return the user data
    res.status(200).json({
      code: 'Success',
      user,
    });
  } catch (error) {
    // Log the error for debugging purposes
    logger.error('Error fetching user:', error);

    // Return a 500 Internal Server Error response
    return res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
    });
  }
};

// Export
export default getUser;
