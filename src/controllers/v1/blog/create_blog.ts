/**
 * Author: Monayem Hossain Limon
 * GitHub: https://github.com/Limon00001
 * Date: 10 Aug, 2025
 * @copyright 2025 monayem_hossain_limon
 */

// External Imports
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

// Internal Imports
import { logger } from '@/lib/winston';
import { Blog } from '@/models/Blog';

// Types
import type { IBlog } from '@/models/Blog';
import type { Request, Response } from 'express';

type BlogData = Pick<IBlog, 'title' | 'content' | 'banner' | 'status'>;

// DOMPurify Setup & Purify the content
const window = new JSDOM('').window;
const purify = DOMPurify(window);

/**
 * Create a new blog post
 */
const createBlog = async (req: Request, res: Response) => {
  try {
    // Destructure the request body
    const { title, content, banner, status } = req.body as BlogData;

    // Get user ID
    const userId = req.userId;

    // Clean the content using DOMPurify
    const cleanContent = purify.sanitize(content);

    // Create a new blog
    const newBlog = await Blog.create({
      title,
      content: cleanContent,
      banner,
      status,
      author: userId,
    });

    // Log the blog creation
    logger.info('Blog created successfully', newBlog);

    // Send a success response with the new blog
    res.status(201).json({
      code: 'Success',
      message: 'Blog created successfully',
      blog: newBlog,
    });
  } catch (error) {
    // Log the error for debugging purposes
    logger.error('Error creating blog post', error);

    // Send a user-friendly error message
    return res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
      error: error,
    });
  }
};

// Export
export default createBlog;
