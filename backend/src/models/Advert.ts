import mongoose, { Schema, Types } from 'mongoose';
import { uppercase } from 'zod';

export interface Advert {
  _id: Types.ObjectId;
  name: string;
  description: string;
  price: number;
  isSale: boolean;
  image?: string;
  tags?: string[];
  status: 'AVAILABLE' | 'SOLD' | 'RESERVED';
}

const advertSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    isSale: {
      type: Boolean,
    },
    image: {
      type: String,
    },
    tags: {
      type: [String],
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      required: true,
      uppercase: true,
      default: 'AVAILABLE',
      enum: ['AVAILABLE', 'SOLD', 'RESERVED'],
    },
  },
  { timestamps: true }
);

export const Advert = mongoose.model('Advert', advertSchema, 'adverts');
