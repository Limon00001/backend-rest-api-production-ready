/**
 * Author: Monayem Hossain Limon
 * GitHub: https://github.com/Limon00001
 * Date: 02 Aug, 2025
 * @copyright 2025 monayem_hossain_limon
 */

// External Imports
import { model, Schema, Types } from 'mongoose';

interface IToken {
  token: string;
  userId: Types.ObjectId;
}

const tokenSchema = new Schema<IToken>(
  {
    token: {
      type: String,
      required: [true, 'Token is required'],
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: [true, 'User ID is required'],
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  },
);

// Token Model
const Token = model<IToken>('Token', tokenSchema);

// Export
export default Token;
