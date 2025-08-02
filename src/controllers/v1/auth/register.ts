/**
 * Author: Monayem Hossain Limon
 * GitHub: https://github.com/Limon00001
 * Date: 01 Aug, 2025
 * @copyright 2025 monayem_hossain_limon
 */

// Internal Imports
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';
import { logger } from '@/lib/winston';
import Token from '@/models/Token';
import { User } from '@/models/User';
import { generateRandomUsername } from '@/utils';

// Types
import config from '@/config';
import { IUser } from '@/models/User';
import type { Request, Response } from 'express';

// User Registration Data Type
// This type is used to define the structure of the user data that will be registered.
type UserData = Pick<IUser, 'email' | 'password' | 'role'>;

const register = async (req: Request, res: Response) => {
  const { email, password, role } = req.body as UserData;

  // Validate role
  if (role === 'admin' && !config.WHITELIST_ADMINS_MAIL.includes(email)) {
    // Log the attempt to register as admin without permission
    logger.warn(
      `User with email ${email} tried to register as admin without permission.`,
    );

    // If the user is trying to register as an admin but their email is not whitelisted, return an error.
    // This is a security measure to prevent unauthorized users from gaining admin access.
    return res.status(403).json({
      code: 'AuthorizationError',
      message: 'You are not allowed to register as an admin.',
    });
  }

  try {
    // Generate a random username
    const username = generateRandomUsername();

    // Create a new user
    const newUser = await User.create({
      username,
      email,
      password,
      role,
    });

    /**
     * Generate Access and Refresh Tokens
     * These tokens are generated for the newly created user to manage authentication and session.
     * Access tokens are typically used for short-lived sessions, while refresh tokens are used to obtain new access tokens without requiring the user to log in again.
     */
    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);

    // Store the refresh token in the database
    await Token.create({
      token: refreshToken,
      userId: newUser._id,
    });

    // Log the successful creation of the refresh token
    logger.info('Refresh token created successfully', {
      userId: newUser._id,
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
      maxAge: config.REFRESH_TOKEN_EXPIRY
        ? parseInt(config.REFRESH_TOKEN_EXPIRY)
        : 7 * 24 * 60 * 60 * 1000, // Default to 7 days if not set
    });

    // Respond with the user data and access token
    res.status(201).json({
      user: {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
      accessToken,
    });

    // Log the successful registration
    // This log entry is useful for tracking user registrations and debugging issues related to user creation.
    logger.info('User registered successfully', {
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
      error: error,
    });

    logger.error('Error occurred during user registration:', error);
  }
};

// Export
export default register;
