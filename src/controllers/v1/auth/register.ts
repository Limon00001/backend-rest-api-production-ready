/**
 * Author: Monayem Hossain Limon
 * GitHub: https://github.com/Limon00001
 * Date: 01 Aug, 2025
 * @copyright 2025 monayem_hossain_limon
 */

// Internal Imports
import { logger } from '@/lib/winston';
import { User } from '@/models/User';
import { generateRandomUsername } from '@/utils';

// Types
import { IUser } from '@/models/User';
import type { Request, Response } from 'express';

// User Registration Data Type
// This type is used to define the structure of the user data that will be registered.
type UserData = Pick<IUser, 'email' | 'password' | 'role'>;

const register = async (req: Request, res: Response) => {
  const { email, password, role } = req.body as UserData;

  try {
    const username = generateRandomUsername();

    const user = await User.create({
      username,
      email,
      password,
      role,
    });

    res.status(201).json({
      message: 'User registered successfully.',
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
