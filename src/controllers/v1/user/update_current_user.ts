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

// Controller Function for updating the current user
const updateCurrentUser = async (req: Request, res: Response) => {
  // Get user ID from request
  const userId = req.userId;

  // Check if userId is available
  // If not, return a 400 Bad Request response
  if (!userId) {
    return res.status(400).json({
      code: 'AuthenticationError',
      message: 'User ID is required to update current user information.',
    });
  }

  // Extract user data from request body
  const {
    username,
    email,
    password,
    first_name,
    last_name,
    website,
    facebook,
    instagram,
    linkedin,
    x,
    youtube,
  } = req.body;

  try {
    // Find user by ID and include password for hashing
    // Use select('+password -__v') to include password for hashing and exclude version from
    // Use exec() to execute the query and return a Mongoose document
    const user = await User.findById(userId).select('+password -__v').exec();

    // Check if user exists
    // If not, return a 404 Not Found response
    if (!user) {
      return res.status(404).json({
        code: 'NotFound',
        message: 'User not found',
      });
    }

    // Update user fields if provided
    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = password; // Password will be hashed by Mongoose pre-save hook
    if (first_name) user.firstName = first_name;
    if (last_name) user.lastName = last_name;
    if (!user.socialLinks) {
      user.socialLinks = {};
    }
    // Update social links if provided
    if (website) user.socialLinks.website = website;
    if (facebook) user.socialLinks.facebook = facebook;
    if (instagram) user.socialLinks.instagram = instagram;
    if (linkedin) user.socialLinks.linkedin = linkedin;
    if (x) user.socialLinks.x = x;
    if (youtube) user.socialLinks.youtube = youtube;

    // Save the updated user document
    await user.save();

    // Log the successful update
    logger.info(`User updated successfully: ${user}`);

    // Return the updated user information with a 200 OK response
    res.status(200).json({
      code: 'Success',
      user,
    });
  } catch (error) {
    // Log the error for debugging purposes
    logger.error('Error updating user:', error);

    // Return a 500 Internal Server Error response
    return res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
      error,
    });
  }
};

// Export
export default updateCurrentUser;
