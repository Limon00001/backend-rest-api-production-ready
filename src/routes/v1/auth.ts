/**
 * Author: Monayem Hossain Limon
 * GitHub: https://github.com/Limon00001
 * Date: 01 Aug, 2025
 * @copyright 2025 monayem_hossain_limon
 */

// External Imports
import bcryptjs from 'bcryptjs';
import { Router } from 'express';
import { body, cookie } from 'express-validator';

// Internal Imports
import login from '@/controllers/v1/auth/login';
import refreshToken from '@/controllers/v1/auth/refresh_token';
import register from '@/controllers/v1/auth/register';
import validationErrors from '@/middlewares/validationErrors';
import { User } from '@/models/User';

// Router Instance
const router = Router();

// Routes
router.post(
  '/register',
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .isLength({ max: 50 })
    .withMessage('Email must be at less than 50 characters')
    .custom(async (value) => {
      // Check if the email is already registered
      const existingUser = await User.exists({ email: value });

      // Check if user already exists in the database
      if (existingUser) {
        throw new Error('User email or password is invalid');
      }
      return true; // Return true to indicate validation passed
    }),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8, max: 20 })
    .withMessage('Password must be at least 8 characters long')
    .custom((value, { req }) => {
      // Check if the password is the same as the email
      if (value === req.body.email) {
        throw new Error('Password must be different from email');
      }
      return true; // Return true to indicate validation passed
    }),
  body('role')
    .optional()
    .isString()
    .withMessage('Role must be a string')
    .isIn(['user', 'admin'])
    .withMessage('Role must be either user or admin'),
  validationErrors,
  register,
);

router.post(
  '/login',
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .isLength({ max: 50 })
    .withMessage('Email must be at less than 50 characters')
    .custom(async (value) => {
      // Check if the email is already registered
      const existingUser = await User.exists({ email: value });

      // Check if user already exists in the database
      if (!existingUser) {
        throw new Error('User email or password is invalid');
      }

      return true; // Return true to indicate validation passed
    }),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8, max: 20 })
    .withMessage('Password must be at least 8 characters long')
    .custom(async (value, { req }) => {
      // Extract email from request body
      const { email } = req.body as { email: string };

      // Find the user by email and select only the password field
      const user = await User.findOne({ email })
        .select('password')
        .lean()
        .exec();

      // If user not found, throw an error
      if (!user) {
        throw new Error('User email or password is invalid');
      }

      // Compare the provided password with the stored hashed password
      const isMatchPassword = await bcryptjs.compare(value, user.password);

      // If the password does not match, throw an error
      if (!isMatchPassword) {
        throw new Error('User email or password is invalid');
      }

      return true; // Return true to indicate validation passed
    }),
  validationErrors,
  login,
);

router.post(
  '/refresh-token',
  cookie('refreshToken')
    .notEmpty()
    .withMessage('Refresh token is required')
    .isJWT()
    .withMessage('Invalid refresh token'),
  validationErrors,
  refreshToken,
);

// Export
export default router;
