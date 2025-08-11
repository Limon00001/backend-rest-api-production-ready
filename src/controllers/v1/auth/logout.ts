/**
 * Author: Monayem Hossain Limon
 * GitHub: https://github.com/Limon00001
 * Date: 04 Aug, 2025
 * @copyright 2025 monayem_hossain_limon
 */

// Internal Imports
import { logger } from '@/lib/winston';
import Token from '@/models/Token';

// Types
import type { Request, Response } from 'express';

// Logout Function
const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get refresh token from cookies
    const refreshToken = req.cookies.refreshToken as string;

    // If refresh token is present, delete it from the database
    if (refreshToken) {
      // Delete the refresh token from the database
      await Token.deleteOne({ token: refreshToken });

      logger.info('User refresh token deleted successfully', {
        userId: req.userId,
        token: refreshToken,
      });
    }

    // Clear the refresh token cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set secure flag in production
      sameSite: 'strict', // Set SameSite attribute to prevent CSRF attacks
    });

    res.sendStatus(204); // Send a 204 No Content response

    logger.info('User logged out successfully', {
      userId: req.userId,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
      error: error,
    });

    logger.error('Error occurred during logout', error);
  }
};

// Export
export default logout;
