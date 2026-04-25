import mongoose, { Schema, Types } from 'mongoose';

export interface Advert {
  _id: Types.ObjectId;
  name: string;
  description: string;
  price: number;
  isSale: boolean;
  image?: string;
  tags?: string[];
}

const advertSchema = new Schema(
  {
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
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
      index: true,
    },
  },
  { timestamps: true }
);

export const Advert = mongoose.model('Advert', advertSchema, 'adverts');
