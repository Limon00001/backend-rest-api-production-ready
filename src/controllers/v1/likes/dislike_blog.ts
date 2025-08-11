/**
 * Author: Monayem Hossain Limon
 * GitHub: https://github.com/Limon00001
 * Date: 10 Aug, 2025
 * @copyright 2025 monayem_hossain_limon
 */

// Internal Imports
import { logger } from '@/lib/winston';
import { Blog } from '@/models/Blog';
import { Like } from '@/models/Like';

// Types
import type { Request, Response } from 'express';

/**
 * Dislike a blog Controller
 */
const disLikeBlog = async (req: Request, res: Response) => {
  // Destructure the request body
  const { blogId } = req.params;
  const { userId } = req.body;

  try {
    // Check if the user has already liked the blog
    const existingLike = await Like.findOne({
      blogId,
      userId,
    })
      .lean()
      .exec();

    // If the user has not liked the blog, return a 404 Not Found response
    if (!existingLike) {
      return res.status(404).json({
        code: 'NotFound',
        message: 'Like not found',
      });
    }

    // Delete the like from the database
    await Like.deleteOne({
      _id: existingLike._id,
    });

    // Find the blog by ID and select the likesCount field
    const blog = await Blog.findById(blogId).select('likesCount').exec();

    // Check if the blog exists
    if (!blog) {
      return res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found',
      });
    }

    // Decrement the likesCount of the blog
    blog.likesCount--;

    // Save the blog to the database
    await blog.save();

    // Log the blog dislike
    logger.info('Blog disliked successfully', {
      userId,
      blogId: blog._id,
      likesCount: blog.likesCount,
    });

    // Send a 204 No Content response
    res.sendStatus(204);
  } catch (error) {
    // Log the error for debugging purposes
    logger.error('Error disliking blog', error);

    // Send a user-friendly error message
    return res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
      error: error,
    });
  }
};

// Export
export default disLikeBlog;
