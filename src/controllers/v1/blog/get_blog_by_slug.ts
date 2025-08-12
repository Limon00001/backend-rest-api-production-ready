/**
 * Author: Monayem Hossain Limon
 * GitHub: https://github.com/Limon00001
 * Date: 11 Aug, 2025
 * @copyright 2025 monayem_hossain_limon
 */

// Internal Imports
import { logger } from '@/lib/winston';
import { Blog } from '@/models/Blog';
import { User } from '@/models/User';

// Types
import type { Request, Response } from 'express';

// Controller Function to get blogs by the slug
/** * Controller to get blogs by slug.
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
const getBlogBySlug = async (req: Request, res: Response) => {
  // Get user ID from request
  const userId = req.userId;

  // Get slug from request params
  const { slug } = req.params;

  try {
    /**
     * Get user role
     * Use lean() to return a plain JavaScript object instead of a Mongoose document
     * This improves performance and reduces memory usage
     */
    const user = await User.findById(userId).select('role').lean().exec();

    /**
     * Find a blog by slug
     * Use select('-__v') to exclude version from the response
     * Use limit and skip for pagination
     * Use lean() to return a plain JavaScript object instead of a Mongoose document
     * Use sort({ createdAt: -1 }) to sort by created at in descending order
     */
    const blog = await Blog.findOne({ slug })
      .select('-banner.publicId -__v') // Exclude version from the response
      .populate('author', '-createdAt -updatedAt -__v')
      .lean()
      .exec();

    // Check if blog exists
    // If not, return a 404 Not Found response
    if (!blog) {
      return res.status(404).json({
        code: 'BlogNotFound',
        message: 'Blog not found',
      });
    }

    // Check if user is a normal user and blog is a draft
    if (user?.role === 'user' && blog.status === 'draft') {
      // Log the user trying to access a draft blog
      logger.warn('A user tried to access a draft blog.', {
        userId,
        blog,
      });

      // If user is a normal user and blog is a draft, return a 403 Forbidden response
      return res.status(403).json({
        code: 'AuthorizationError',
        message:
          'Access denied. You are not authorized to perform this action.',
      });
    }

    // Return the blogs with a 200 OK response
    // Include limit, offset, and total in the response
    // This helps the client understand the pagination
    return res.status(200).json({
      blog,
    });
  } catch (error) {
    // Log the error for debugging purposes
    logger.error('Error fetching blog by slug:', error);

    // Return a 500 Internal Server Error response
    return res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
      error,
    });
  }
};

// Export
export default getBlogBySlug;
