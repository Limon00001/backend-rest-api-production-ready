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
import { connectToDatabase, disconnectFromDatabase } from '@/lib/mongoose';
import { logger, logtail } from '@/lib/winston';
import v1Routes from '@/routes/v1';

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
      logger.warn(
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
    // Database Connection
    await connectToDatabase();

    // Routes
    app.use('/api/v1', v1Routes);

    // Server Listening
    app.listen(config.PORT, () => {
      logger.info(`Server is running on http://localhost:${config.PORT}`);
    });
  } catch (error) {
    // Handle server startup errors
    logger.error(`Failed to start server: ${error}`);

    if (config.NODE_ENV === 'production') {
      // Exit the process in production mode
      process.exit(1);
    }
  }
})();

/**
 * Handles server shutdown gracefully by disconnecting from the database
 *
 * - Attempts to disconnect from the database before shutting down the server
 * - If an error occurs during database disconnection, logs a message to the console and the process is exited with `0` status code (indicates successful shutdown)
 */
const handleServerShutdown = async () => {
  try {
    // Database Disconnection
    await disconnectFromDatabase();
    logger.warn('Shutting down server...');
    await logtail.flush(); // Ensure all logs are sent before shutting down
    process.exit(0);
  } catch (error) {
    // Handle database disconnection errors
    logger.error(`Failed to disconnect from database: ${error}`);
  }
};

/**
 * Event listeners to terminate the server gracefully when receiving `SIGINT` or `SIGTERM` signals
 *
 * - `SIGINT` signal is sent when the user interrupts the process by pressing Ctrl+C
 * - `SIGTERM` signal is sent when the process is terminated (e.g., using the `kill` command or container termination)
 * - When either signal is received, the `handleServerShutdown` function is called to gracefully shut down the server
 */
process.on('SIGINT', handleServerShutdown);
process.on('SIGTERM', handleServerShutdown);
