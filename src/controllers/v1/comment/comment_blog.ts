/**
 * Author: Monayem Hossain Limon
 * GitHub: https://github.com/Limon00001
 * Date: 12 Aug, 2025
 * @copyright 2025 monayem_hossain_limon
 */

// External Imports
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

// Internal Imports
import { logger } from '@/lib/winston';
import { Blog } from '@/models/Blog';
import { Comment } from '@/models/Comment';

// Types
import type { IComment } from '@/models/Comment';
import type { Request, Response } from 'express';

type CommentData = Pick<IComment, 'content'>;

// DOMPurify Setup & Purify the content
const window = new JSDOM('').window;
const purify = DOMPurify(window);

// Controller Function to comment on a blog
const commentBlog = async (req: Request, res: Response): Promise<void> => {
  // Destructure the request body
  const { blogId } = req.params;
  const { content } = req.body as CommentData;
  const userId = req.userId;

  try {
    // Find the blog by ID and select the commentsCount field
    const blog = await Blog.findById(blogId).select('_id commentsCount').exec();

    // Check if the blog exists
    if (!blog) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found',
      });
      return;
    }

    // Clean the content using DOMPurify
    const cleanContent = purify.sanitize(content);

    // Create a new comment
    const newComment = await Comment.create({
      blogId,
      content: cleanContent,
      userId,
    });

    // Log the comment creation
    logger.info('Comment created successfully', newComment);

    // Update the commentsCount field
    blog.commentsCount++;

    // Save the blog
    await blog.save();

    // Log the comments count update
    logger.info('Blog comments count updated', {
      blogId: blog._id,
      commentsCount: blog.commentsCount,
    });

    // Send a success response
    res.status(201).json({
      comment: newComment,
    });
  } catch (error) {
    // Log the error for debugging purposes
    logger.error('Error during commenting in the blog', error);

    // Send a user-friendly error message
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
      error: error,
    });
  }
};

// Export
export default commentBlog;
