/**
 * Author: Monayem Hossain Limon
 * GitHub: https://github.com/Limon00001
 * Date: 01 Aug, 2025
 * @copyright 2025 monayem_hossain_limon
 */

// External Imports
import { Router } from 'express';
import { body } from 'express-validator';

// Internal Imports
import register from '@/controllers/v1/auth/register';
import validationErrors from '@/middlewares/validationErrors';
import { User } from '@/models/User';

// Router Instance
const router = Router();

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

// Export
export default router;
