/**
 * Author: Monayem Hossain Limon
 * GitHub: https://github.com/Limon00001
 * Date: 27 Jul, 2025
 * @copyright 2025 monayem_hossain_limon
 */

// External Imports
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

// Internal Imports
import config from '@/config';
import limiter from '@/lib/express_rate_limit';

// Types
import type { CorsOptions } from 'cors';

// Express App
const app = express();

// CORS Options
const corsOptions: CorsOptions = {
  origin(requestOrigin, callback) {
    if (
      config.NODE_ENV === 'development' ||
      !requestOrigin ||
      config.WHITELIST_ORIGINS.includes(requestOrigin)
    ) {
      callback(null, true);
    } else {
      // Reject the request from the non-whitelisted origin
      callback(
        new Error(
          `CORS Error: ${requestOrigin} is not allowed by CORS policy.`,
        ),
      );
      console.log(
        `CORS Error: ${requestOrigin} is not allowed by CORS policy.`,
      );
    }
  },
};

// Middleware

// CORS Middleware
app.use(cors(corsOptions));

// Enable JSON Body Parsing
app.use(express.json());

// Enable URL Encoded Body Parsing with Extended Options
// 'extended: true' allows rich objects and arrays via query strings
app.use(express.urlencoded({ extended: true }));

// Enable Cookie Parsing Middleware to parse cookies from requests and attach them to the request object
app.use(cookieParser());

// Compression Middleware
// Enable response compression to reduce payload size and improve performance
app.use(
  compression({
    threshold: 1024, // Only compress responses larger than 1kb
  }),
);

// Use Helmet Middleware to secure HTTP headers
app.use(helmet());

// Apply rate limiting middleware to limit the number of requests per IP address (e.g., 10 requests per minute)
app.use(limiter);

/**
 * Immediately invoked async function expression (IIFE) to start the server
 *
 * - Tries to connect to the database before initializing the server
 * - Defines the api routes ('/api/v1')
 * - Starts the server on the specified port and logs a message to the console
 * - If an error occurs during server startup, logs a message to the console and the process is exited with a non-zero exit code
 */
(async () => {
  try {
    // Routes
    app.use('/', (req, res) => {
      res.json({ message: 'Hello World' });
    });

    // Server Listening
    app.listen(config.PORT, () => {
      console.log(`Server is running on http://localhost:${config.PORT}`);
    });
  } catch (error) {
    // Handle server startup errors
    console.log(`Failed to start server: ${error}`);

    if (config.NODE_ENV === 'production') {
      // Exit the process in production mode
      process.exit(1);
    }
  }
})();
