/**
 * Author: Monayem Hossain Limon
 * GitHub: https://github.com/Limon00001
 * Date: 02 Aug, 2025
 * @copyright 2025 monayem_hossain_limon
 */

// Internal Imports
import config from '@/config';
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';
import { logger } from '@/lib/winston';
import Token from '@/models/Token';
import { User } from '@/models/User';

// Types
import { IUser } from '@/models/User';
import type { Request, Response } from 'express';

// User Login Data Type
type UserData = Pick<IUser, 'email' | 'password' | 'role'>;

// User Login Function
const login = async (req: Request, res: Response) => {
  const { email } = req.body as UserData;

  try {
    /**
     * Find a user by email and return selected fields (username, email, role, password)
     * Converts result to a plain JS object for better performance (no Mongoose document overhead)
     */
    const user = await User.findOne({ email })
      .select('username email role password')
      .lean()
      .exec();

    // If user not found, return an error
    if (!user) {
      return res.status(404).json({
        code: 'NotFound',
        message: 'User not found',
      });
    }

    /**
     * Generate Access and Refresh Tokens
     * These tokens are generated for the newly created user to manage authentication and session.
     * Access tokens are typically used for short-lived sessions, while refresh tokens are used to obtain new access tokens without requiring the user to log in again.
     */
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Store the refresh token in the database
    await Token.create({
      token: refreshToken,
      userId: user._id,
    });

    // Log the successful creation of the refresh token
    logger.info('Refresh token created successfully', {
      userId: user._id,
      token: refreshToken,
    });

    /**
     * Set the refresh token in a secure, HTTP-only cookie
     * This ensures that the refresh token is not accessible via JavaScript, enhancing security against XSS attacks.
     * The cookie is set with the 'httpOnly' flag, which prevents client-side scripts from accessing the cookie, and the 'secure' flag is set to true in production to ensure that the cookie is only sent over HTTPS.
     * The 'sameSite' attribute is set to 'strict' to prevent the browser from sending the cookie along with cross-site requests, which helps mitigate CSRF attacks.
     * The 'maxAge' is set to 7 days, which defines how long the cookie will be valid.
     */
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    // Respond with the user data and access token
    res.status(201).json({
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
      },
      accessToken,
    });

    // Log the successful login
    // This log entry is useful for tracking user logins and debugging issues related to user authentication.
    logger.info('User logged in successfully', user);
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
      error: error,
    });

    logger.error('Error occurred during user login:', error);
  }
};

// Export
export default login;
