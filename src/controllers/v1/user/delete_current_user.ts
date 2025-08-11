/**
 * Author: Monayem Hossain Limon
 * GitHub: https://github.com/Limon00001
 * Date: 09 Aug, 2025
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
