/**
 * Author: Monayem Hossain Limon
 * GitHub: https://github.com/Limon00001
 * Date: 27 Jul, 2025
 * @copyright 2025 monayem_hossain_limon
 */

// External Imports
import cors from 'cors';
import express from 'express';

// Internal Imports
import config from '@/config';

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

// Routes
app.use('/', (req, res) => {
  res.json({ message: 'Hello World' });
});

// Server Listening
app.listen(config.PORT, () => {
  console.log(`Server is running on http://localhost:${config.PORT}`);
});
