/**
 * Author: Monayem Hossain Limon
 * GitHub: https://github.com/Limon00001
 * Date: 02 Aug, 2025
 * @copyright 2025 monayem_hossain_limon
 */

// External Imports
import { validationResult } from 'express-validator';

// Types
import type { NextFunction, Request, Response } from 'express';

// Middleware
const validationErrors = (req: Request, res: Response, next: NextFunction) => {
  // Validate the request using express-validator
  const errors = validationResult(req);

  // If there are validation errors, return a 400 response with the error details
  if (!errors.isEmpty()) {
    return res.status(400).json({
      code: 'ValidationError',
      errors: errors.mapped(),
    });
  }

  // If there are no validation errors, proceed to the next middleware or route handler
  next();
};

// Export
export default validationErrors;
