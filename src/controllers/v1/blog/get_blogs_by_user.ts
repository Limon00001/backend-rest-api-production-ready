/**
 * Author: Monayem Hossain Limon
 * GitHub: https://github.com/Limon00001
 * Date: 11 Aug, 2025
 * @copyright 2025 monayem_hossain_limon
 */

// Internal Imports
import config from '@/config';
import { logger } from '@/lib/winston';
import { Blog } from '@/models/Blog';
import { User } from '@/models/User';

// Types
import type { Request, Response } from 'express';

// Query Type for filtering
interface QueryType {
  status?: 'draft' | 'published';
}

// Controller Function to get blogs by user
/** * Controller to get blogs by user.
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
const getBlogsByUser = async (req: Request, res: Response) => {
  // Get user ID from request params
  const userId = req.params.userId;

  // Get current user ID
  const currentUserId = req.userId;

  try {
    // Get limit and offset from query parameters
    // If not provided, use default values from config
    // Use parseInt to convert string to number, and provide default values if not present
    const limit = parseInt(req.query.limit as string) || config.DefaultResLimit;
    const offset =
      parseInt(req.query.offset as string) || config.DefaultResOffset;

    /**
     * Get user role
     * Use lean() to return a plain JavaScript object instead of a Mongoose document
     * This improves performance and reduces memory usage
     */
    const currentUser = await User.findById(currentUserId)
      .select('role')
      .lean()
      .exec();

    // Create query object
    const query: QueryType = {};

    // Show only published blogs to a normal user
    if (currentUser?.role === 'user') {
      query.status = 'published';
    }

    // Get total number of blogs for the user and query
    const total = await Blog.countDocuments({ author: userId, ...query });

    /**
     * Find all blogs with pagination
     * Use select('-__v') to exclude version from the response
     * Use limit and skip for pagination
     * Use lean() to return a plain JavaScript object instead of a Mongoose document
     * Use sort({ createdAt: -1 }) to sort by created at in descending order
     */
    const blogs = await Blog.find({ author: userId, ...query })
      .select('-banner.publicId -__v') // Exclude version from the response
      .populate('author', '-createdAt -updatedAt -__v')
      .limit(limit)
      .skip(offset)
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    // Return the blogs with a 200 OK response
    // Include limit, offset, and total in the response
    // This helps the client understand the pagination
    return res.status(200).json({
      limit,
      offset,
      total,
      blogs,
    });
  } catch (error) {
    // Log the error for debugging purposes
    logger.error('Error fetching blogs by user:', error);

    // Return a 500 Internal Server Error response
    return res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
      error,
    });
  }
};

// Export
export default getBlogsByUser;
