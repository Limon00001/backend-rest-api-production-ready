/**
 * Author: Monayem Hossain Limon
 * GitHub: https://github.com/Limon00001
 * Date: 09 Aug, 2025
 * @copyright 2025 monayem_hossain_limon
 */

// Internal Imports
import config from '@/config';
import { logger } from '@/lib/winston';
import { User } from '@/models/User';

// Types
import type { Request, Response } from 'express';

// Controller Function to get all users
/** * Controller to get all users.
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
const getAllUser = async (req: Request, res: Response) => {
  try {
    // Get limit and offset from query parameters
    // If not provided, use default values from config
    // Use parseInt to convert string to number, and provide default values if not present
    const limit = parseInt(req.query.limit as string) || config.DefaultResLimit;
    const offset =
      parseInt(req.query.offset as string) || config.DefaultResOffset;

    // Get total number of users
    const total = await User.countDocuments();

    // Find all users with pagination
    // Use select('-__v') to exclude version from the response
    // Use limit and skip for pagination
    // Use lean() to return a plain JavaScript object instead of a Mongoose document
    const users = await User.find()
      .select('-__v') // Exclude version from the response
      .limit(limit)
      .skip(offset)
      .lean()
      .exec();

    // Check if users exist
    // If not, return a 404 Not Found response
    if (users.length === 0) {
      return res.status(404).json({
        code: 'NotFound',
        message: 'No users found',
      });
    }

    // Return the users with a 200 OK response
    // Include limit, offset, and total in the response
    // This helps the client understand the pagination
    return res.status(200).json({
      limit,
      offset,
      total,
      users,
    });
  } catch (error) {
    // Log the error for debugging purposes
    logger.error('Error fetching users:', error);

    // Return a 500 Internal Server Error response
    return res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
      error,
    });
  }
};

// Export
export default getAllUser;
