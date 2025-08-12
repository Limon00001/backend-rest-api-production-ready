/**
 * Author: Monayem Hossain Limon
 * GitHub: https://github.com/Limon00001
 * Date: 11 Aug, 2025
 * @copyright 2025 monayem_hossain_limon
 */

// External Imports
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

// Internal Imports
import { logger } from '@/lib/winston';
import { Blog } from '@/models/Blog';
import { User } from '@/models/User';

// Types
import type { IBlog } from '@/models/Blog';
import type { Request, Response } from 'express';

type BlogData = Partial<Pick<IBlog, 'title' | 'content' | 'banner' | 'status'>>;

// DOMPurify Setup & Purify the content
const window = new JSDOM('').window;
const purify = DOMPurify(window);

/**
 * Update a new blog post
 */
const updateBlog = async (req: Request, res: Response) => {
  try {
    // Destructure the request body
    const { title, content, banner, status } = req.body as BlogData;

    // Get user ID
    const userId = req.userId;

    // Get blog ID
    const { blogId } = req.params;

    // Get user and role
    const user = await User.findById(userId).select('role').lean().exec();

    // Find the blog
    const blog = await Blog.findById(blogId).select('-__v').exec();

    // Check if the blog exists
    if (!blog) {
      return res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found',
      });
    }

    // Check if the user is authorized admin to update the blog
    if (blog.author !== userId && user?.role !== 'admin') {
      logger.warn('A user tried to update a blog without permission', {
        userId,
        blog,
      });

      return res.status(403).json({
        code: 'AuthorizationError',
        message:
          'Access denied. You are not authorized to perform this action.',
      });
    }

    // Update the blog
    if (title) blog.title = title;

    // Clean the content using DOMPurify
    if (content) {
      const cleanContent = purify.sanitize(content);
      blog.content = cleanContent;
    }
    if (banner) blog.banner = banner;
    if (status) blog.status = status;

    // Save the blog
    await blog.save();

    // Log the blog update
    logger.info('Blog updated successfully', blog);

    // Send a success response
    res.status(200).json({
      blog,
    });
  } catch (error) {
    // Log the error for debugging purposes
    logger.error('Error updating blog post', error);

    // Send a user-friendly error message
    return res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
      error: error,
    });
  }
};

// Export
export default updateBlog;
