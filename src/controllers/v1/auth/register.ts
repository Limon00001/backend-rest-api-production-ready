/**
 * Author: Monayem Hossain Limon
 * GitHub: https://github.com/Limon00001
 * Date: 01 Aug, 2025
 * @copyright 2025 monayem_hossain_limon
 */

// Internal Imports
import { logger } from '@/lib/winston';

// Types
import type { Request, Response } from 'express';

const resgister = async (req: Request, res: Response) => {
  try {
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
export default resgister;
