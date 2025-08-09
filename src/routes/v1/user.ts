/**
 * Author: Monayem Hossain Limon
 * GitHub: https://github.com/Limon00001
 * Date: 06 Aug, 2025
 * @copyright 2025 monayem_hossain_limon
 */

// External Imports
import { Router } from 'express';
import { body, query } from 'express-validator';

// Internal Imports
import deleteCurrentUser from '@/controllers/v1/user/delete_current_user';
import getAllUser from '@/controllers/v1/user/get_all_user';
import getCurrentUser from '@/controllers/v1/user/get_current_user';
import updateCurrentUser from '@/controllers/v1/user/update_current_user';
import authenticate from '@/middlewares/authenticate';
import authorize from '@/middlewares/authorize';
import validationErrors from '@/middlewares/validationErrors';
import { User } from '@/models/User';

// Router Instance
const router = Router();

// Routes
router.get(
  '/current',
  authenticate,
  authorize(['user', 'admin']),
  getCurrentUser,
);
router.put(
  '/current',
  authenticate,
  authorize(['user', 'admin']),
  body('username')
    .optional()
    .trim()
    .isString()
    .withMessage('Invalid username format')
    .isLength({ max: 20 })
    .withMessage('Username must be at less than 20 characters')
    .custom(async (value) => {
      // Check if the username already exists
      const userExists = await User.exists({
        username: value,
      });
      if (userExists) {
        throw new Error('This username is already in use');
      }
      return true; // Return true to indicate validation passed
    }),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Invalid email format')
    .isLength({ max: 50 })
    .withMessage('Email must be at less than 50 characters')
    .custom(async (value) => {
      // Check if the email is already registered
      const existingUser = await User.exists({ email: value });
      if (existingUser) {
        throw new Error('This email is already in use');
      }
      return true; // Return true to indicate validation passed
    }),
  body('password')
    .optional()
    .trim()
    .isLength({ min: 8, max: 30 })
    .withMessage('Password must be at least 8 characters long')
    .custom((value, { req }) => {
      // Check if the password is the same as the email
      if (value === req.body.email) {
        throw new Error('Password must be different from email');
      }
      return true; // Return true to indicate validation passed
    }),
  body('first_name')
    .optional()
    .trim()
    .isString()
    .withMessage('First name must be alphabetic characters')
    .isLength({ max: 20 })
    .withMessage('First name must be at less than 20 characters'),
  body('last_name')
    .optional()
    .trim()
    .isString()
    .withMessage('Last name must be alphabetic characters')
    .isLength({ max: 20 })
    .withMessage('Last name must be at less than 20 characters'),
  body(['website', 'facebook', 'instagram', 'linkedin', 'x', 'youtube'])
    .optional()
    .trim()
    .isURL()
    .withMessage('Invalid URL format')
    .isLength({ max: 100 })
    .withMessage('URL must be at less than 100 characters'),
  validationErrors,
  updateCurrentUser,
);
router.delete(
  '/current',
  authenticate,
  authorize(['user', 'admin']),
  deleteCurrentUser,
);

/**
 * Route to get all users
 * Admin only
 * @route GET /v1/users
 * @access Admin
 */
router.get(
  '/',
  authenticate,
  authorize(['admin']),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset must be a non-negative integer'),
  validationErrors,
  getAllUser,
);

// Export
export default router;
