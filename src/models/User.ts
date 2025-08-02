/**
 * Author: Monayem Hossain Limon
 * GitHub: https://github.com/Limon00001
 * Date: 01 Aug, 2025
 * @copyright 2025 monayem_hossain_limon
 */

// External Imports
import bcryptjs from 'bcryptjs';
import { CallbackError, Schema, model } from 'mongoose';

// Types
interface IUser {
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  firstName?: string;
  lastName?: string;
  socialLinks?: {
    website?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    x?: string;
    youtube?: string;
  };
}

// user schema
const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      maxlength: [20, 'Username must be less than 20 characters'],
      unique: [true, 'Username must be unique'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      maxlength: [50, 'Email must be less than 50 characters'],
      unique: [true, 'Email must be unique'],
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
      // The purpose of `select: false` is to protect sensitive information, like passwords, from being accidentally exposed. By excluding the password field from query results, it helps to ensure that this information is not leaked.
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      enum: {
        values: ['user', 'admin'],
        message: '{VALUE} is not a valid role',
      },
      default: 'user',
    },
    firstName: {
      type: String,
      maxlength: [20, 'First name must be less than 20 characters'],
      trim: true,
    },
    lastName: {
      type: String,
      maxlength: [20, 'Last name must be less than 20 characters'],
      trim: true,
    },
    socialLinks: {
      website: {
        type: String,
        maxlength: [100, 'Website must be less than 100 characters'],
        trim: true,
      },
      facebook: {
        type: String,
        maxlength: [
          100,
          'Facebook profile url must be less than 100 characters',
        ],
        trim: true,
      },
      instagram: {
        type: String,
        maxlength: [
          100,
          'Instagram profile url must be less than 100 characters',
        ],
        trim: true,
      },
      linkedin: {
        type: String,
        maxlength: [
          100,
          'LinkedIn profile url must be less than 100 characters',
        ],
        trim: true,
      },
      x: {
        type: String,
        maxlength: [100, 'X profile url must be less than 100 characters'],
        trim: true,
      },
      youtube: {
        type: String,
        maxlength: [
          100,
          'YouTube profile url must be less than 100 characters',
        ],
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  // Check if the password is modified
  if (!this.isModified('password')) {
    return next();
  }

  // If the password is modified, hash it
  try {
    // Hash the password before saving the user
    this.password = await bcryptjs.hash(this.password, 10);
    next();
  } catch (error) {
    next(error as CallbackError);
  }
});

// Create User Model
const User = model<IUser>('User', userSchema);

// Export
export { IUser, User };
