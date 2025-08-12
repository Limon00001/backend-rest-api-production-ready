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
 * Controller to delete a user by ID.
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
const deleteUser = async (req: Request, res: Response) => {
  // Get user ID from request
  const { userId } = req.params;

  try {
    /**
     * Find all the blogs of the user
     * Use lean() to return a plain JavaScript object instead of a Mongoose document
     * This improves performance and reduces memory usage
     */
    const blogs = await Blog.find({ author: userId })
      .select('banner.publicId')
      .lean()
      .exec();

    // Get the public IDs of the user's blogs
    const publicIds = blogs.map(({ banner }) => banner.publicId);

    // Delete the user's blogs from Cloudinary
    await cloudinary.api.delete_resources(publicIds);

    // Log the deleted blog banner images from Cloudinary
    logger.info('Multiple blog banner images deleted from Cloudinary', {
      publicIds,
    });

    // Delete all the blogs of the user from the database
    await Blog.deleteMany({ author: userId });

    // Log the deleted blogs from the database
    logger.info('Multiple blogs deleted successfully from the database', {
      userId,
      blogs,
    });

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
