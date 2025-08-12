/**
 * Author: Monayem Hossain Limon
 * GitHub: https://github.com/Limon00001
 * Date: 12 Aug, 2025
 * @copyright 2025 monayem_hossain_limon
 */

// Internal Imports
import { logger } from '@/lib/winston';
import { Blog } from '@/models/Blog';
import { Comment } from '@/models/Comment';

// Types
import type { Request, Response } from 'express';

// Controller Function to get comments by blog
const getCommentsByBlog = async (
  req: Request,
  res: Response,
): Promise<void> => {
  // Destructure the request body
  const { blogId } = req.params;

  try {
    // Find the blog by ID and select the commentsCount field
    const blog = await Blog.findById(blogId).select('_id').lean().exec();

    // Check if the blog exists
    if (!blog) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found',
      });
      return;
    }

    /**
     * Find all comments for the blog
     * Use lean() to return a plain JavaScript object instead of a Mongoose document
     * Use sort({ createdAt: -1 }) to sort by created at in descending order
     */
    const allComments = await Comment.find({ blogId })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    // Send a success response
    res.status(200).json({
      comments: allComments,
    });
  } catch (error) {
    // Log the error for debugging purposes
    logger.error('Error retrieving comments', error);

    // Send a user-friendly error message
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
      error: error,
    });
  }
};

// Export
export default getCommentsByBlog;
