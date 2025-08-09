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

// Controller Function for deleting the current user
/** * Controller to delete the current user's account.
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
const deleteCurrentUser = async (req: Request, res: Response) => {
  const userId = req.userId;

  // Check if userId is available
  // If not, return a 400 Bad Request response
  if (!userId) {
    return res.status(400).json({
      code: 'AuthenticationError',
      message: 'User ID is required to delete current user information.',
    });
  }

  try {
    // Find user by ID and delete the user
    const user = await User.deleteOne({ _id: userId });

    // Check if user exists
    // If not, return a 404 Not Found response
    if (!user) {
      return res.status(404).json({
        code: 'NotFound',
        message: 'User not found',
      });
    }

    // Return a 204 No Content response
    return res.sendStatus(204);
  } catch (error) {
    // Log the error for debugging purposes
    logger.error('Error deleting user:', error);

    // Return a 500 Internal Server Error response
    return res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
    });
  }
};

// Export
export default deleteCurrentUser;
