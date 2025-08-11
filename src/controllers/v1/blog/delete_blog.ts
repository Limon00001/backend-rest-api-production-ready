/**
 * Author: Monayem Hossain Limon
 * GitHub: https://github.com/Limon00001
 * Date: 10 Aug, 2025
 * @copyright 2025 monayem_hossain_limon
 */

// External Imports
import { v2 as cloudinary } from 'cloudinary';

// Internal Imports
import { logger } from '@/lib/winston';
import { Blog } from '@/models/Blog';
import { User } from '@/models/User';

// Types
import type { Request, Response } from 'express';

/**
 * Delete a new blog post
 */
const deleteBlog = async (req: Request, res: Response) => {
  try {
    // Get user ID
    const userId = req.userId;

    // Get blog ID from params
    const { blogId } = req.params;

    /**
     * Get user role
     * Use select('role') to select specific fields
     * Use lean() to return a plain JavaScript object instead of a Mongoose document
     * This improves performance and reduces memory usage
     */
    const user = await User.findById(userId).select('role').lean().exec();

    /**
     * Find blog by ID
     * Use select('author banner.publicId') to select specific fields
     * Use lean() to return a plain JavaScript object instead of a Mongoose document
     * This improves performance and reduces memory usage
     */
    const blog = await Blog.findById(blogId)
      .select('author banner.publicId')
      .lean()
      .exec();

    // Check if the blog exists
    if (!blog) {
      return res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found',
      });
    }

    /**
     * Check if the user is authorized admin to delete the blog
     */
    if (blog.author !== userId && user?.role !== 'admin') {
      // Log the error for debugging purposes
      logger.warn('A user tried to delete a blog without permission.', {
        userId,
      });

      // Send a user-friendly error message
      return res.status(403).json({
        code: 'AuthorizationError',
        message:
          'Access denied. You are not authorized to perform this action.',
      });
    }

    // Delete the blog banner from Cloudinary
    await cloudinary.uploader.destroy(blog.banner.publicId);

    // Log the blog banner deletion from cloudinary
    logger.info('Blog Banner deleted from cloudinary', {
      publicId: blog.banner.publicId,
    });

    // Delete the blog from the database
    await Blog.deleteOne({ _id: blogId });

    // Log the blog deletion from the database
    logger.info('Blog deleted successfully', {
      blogId,
    });

    // Send a response
    res.sendStatus(204);
  } catch (error) {
    // Log the error for debugging purposes
    logger.error('Error deleting blog post', error);

    // Send a user-friendly error message
    return res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
      error: error,
    });
  }
};

// Export
export default deleteBlog;
