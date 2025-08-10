/**
 * Author: Monayem Hossain Limon
 * GitHub: https://github.com/Limon00001
 * Date: 10 Aug, 2025
 * @copyright 2025 monayem_hossain_limon
 */

// Internal Imports
import { logger } from '@/lib/winston';
import { User } from '@/models/User';

// Types
import type { Request, Response } from 'express';

/**
 * Controller to delete a user by ID.
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
const deleteUser = async (req: Request, res: Response) => {
  // Get user ID from request
  const { userId } = req.params;

  try {
    // Delete user by ID
    const user = await User.deleteOne({ _id: userId });

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        code: 'NotFound',
        message: 'User not found',
      });
    }

    // Return a 204 No Content response
    res.sendStatus(204);
  } catch (error) {
    // Log the error for debugging purposes
    logger.error('Error deleting user:', error);

    // Return a 500 Internal Server Error response
    return res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
      error,
    });
  }
};

// Export
export default deleteUser;
