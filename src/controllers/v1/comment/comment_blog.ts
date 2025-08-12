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

// Types
import { Blog } from '@/models/Blog';
import { Comment, type IComment } from '@/models/Comment';
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
    const blog = await Blog.findById(blogId).select('_id commentsCount').exec();

    if (!blog) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found',
      });
      return;
    }

    const cleanContent = purify.sanitize(content);

    const newComment = await Comment.create({
      blogId,
      content: cleanContent,
      userId,
    });

    logger.info('Comment created successfully', newComment);

    blog.commentsCount++;
    await blog.save();

    logger.info('Blog comments count updated', {
      blogId: blog._id,
      commentsCount: blog.commentsCount,
    });

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
