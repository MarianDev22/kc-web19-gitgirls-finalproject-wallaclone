import mongoose, { Schema, Types } from 'mongoose';

export enum AdvertStatus {
  Available = 'AVAILABLE',
  Reserved = 'RESERVED',
  Sold = 'SOLD',
}

export interface Advert {
  _id: Types.ObjectId;
  name: string;
  description: string;
  price: number;
  isSale: boolean;
  image: string;
  tags: string[];
  ownerId: Types.ObjectId;
  status: AdvertStatus;
}

const advertSchema = new Schema<Advert>(
  {
    name: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    isSale: {
      type: Boolean,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      required: true,
      default: [],
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: AdvertStatus.Available,
      enum: Object.values(AdvertStatus),
    },
  },
  { timestamps: true }
);

export const Advert = mongoose.model('Advert', advertSchema, 'adverts');
