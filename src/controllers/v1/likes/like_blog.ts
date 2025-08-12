/**
 * Author: Monayem Hossain Limon
 * GitHub: https://github.com/Limon00001
 * Date: 11 Aug, 2025
 * @copyright 2025 monayem_hossain_limon
 */

// Internal Imports
import { logger } from '@/lib/winston';
import { Blog } from '@/models/Blog';
import { Like } from '@/models/Like';

// Types
import type { Request, Response } from 'express';

/**
 * Like a blog Controller
 */
const likeBlog = async (req: Request, res: Response) => {
  // Destructure the request body
  const { blogId } = req.params;
  const { userId } = req.body;

  try {
    // Find the blog by ID and select the likesCount field
    const blog = await Blog.findById(blogId).select('likesCount').exec();

    // Check if the blog exists
    if (!blog) {
      return res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found',
      });
    }

    // Check if the user has already liked the blog
    const existingLike = await Like.findOne({
      blogId,
      userId,
    })
      .lean()
      .exec();

    // If the user has already liked the blog, return a 400 Bad Request response
    if (existingLike) {
      return res.status(400).json({
        code: 'BadRequest',
        message: 'You have already liked this blog',
      });
    }

    // Create a new like document
    await Like.create({
      blogId,
      userId,
    });

    // Increment the likesCount field of the blog
    blog.likesCount++;

    // Save the blog
    await blog.save();

    // Log the blog creation
    logger.info('Blog liked successfully', {
      userId,
      blogId: blog._id,
      likesCount: blog.likesCount,
    });

    // Send a success response
    res.status(200).json({
      likesCount: blog.likesCount,
    });
  } catch (error) {
    // Log the error for debugging purposes
    logger.error('Error liking blog', error);

    // Send a user-friendly error message
    return res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
      error: error,
    });
  }
};

// Export
export default likeBlog;
