/**
 * Author: Monayem Hossain Limon
 * GitHub: https://github.com/Limon00001
 * Date: 10 Aug, 2025
 * @copyright 2025 monayem_hossain_limon
 */

// Internal Imports
import uploadToCloudinary from '@/lib/cloudinary';
import { logger } from '@/lib/winston';
import { Blog } from '@/models/Blog';

// Types
import type { UploadApiErrorResponse } from 'cloudinary';
import type { NextFunction, Request, Response } from 'express';

// Constants
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

// Upload Blog Banner Middleware
const uploadBlogBanner = (method: 'post' | 'put') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Check if the request method is POST or PUT
    if (method === 'put' && !req.file) {
      return next();
    }

    // Check if a file is uploaded
    if (!req.file) {
      return res.status(400).json({
        code: 'ValidationError',
        message: 'No file uploaded. Banner is required.',
      });
    }

    // Check if the file size is within the allowed limit
    if (req.file.size > MAX_FILE_SIZE) {
      return res.status(413).json({
        code: 'ValidationError',
        message: 'File size is too large. Maximum allowed size is 2MB.',
      });
    }

    try {
      const { blogId } = req.params;
      const blog = await Blog.findById(blogId).select('banner.publicId').exec();

      // Upload the file to Cloudinary
      const data = await uploadToCloudinary(
        req.file.buffer,
        blog?.banner.publicId.replace('blog-api/', ''),
      );

      // Check if the upload was successful or not
      if (!data) {
        // Log the error for debugging purposes
        logger.error('Error uploading file to Cloudinary.', {
          blogId,
          publicId: blog?.banner.publicId,
        });

        // Return a 500 Internal Server Error response
        return res.status(500).json({
          code: 'ServerError',
          message: 'Error uploading file to Cloudinary.',
        });
      }

      // Update the blog with the new banner data
      const newBanner = {
        url: data.secure_url,
        publicId: data.public_id,
        width: data.width,
        height: data.height,
      };

      // Log the success for debugging purposes
      logger.info('File uploaded to Cloudinary.', {
        blogId,
        banner: newBanner,
      });

      // Update the blog banner with the new banner data
      req.body.banner = newBanner;

      // Call the next middleware
      next();
    } catch (error: UploadApiErrorResponse | any) {
      // Log the error for debugging purposes
      logger.error('Error uploading banner to Cloudinary.', error);

      // Return a 500 Internal Server Error response
      return res.status(error.http_code).json({
        code: error.http_code < 500 ? 'ValidationError' : error.name,
        message: error.message,
      });
    }
  };
};

// Export
export default uploadBlogBanner;
