import mongoose, { Schema, Types } from 'mongoose';

export interface User {
  _id: Types.ObjectId;
  email: string;
  username: string;
  password?: string;
}

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    select: false,
    required: true,
  },
});

export const User = mongoose.model('User', userSchema, 'users');
