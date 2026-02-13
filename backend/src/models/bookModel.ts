import { Schema, model, Document, Types } from 'mongoose';

export interface IBook extends Document {
  userId: Types.ObjectId;
  title: string;
  color: string;
  description: string;
  totalTopics: number;
  completedTopics: number;
  isFavourite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const bookSchema = new Schema<IBook>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    color: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    totalTopics: {
      type: Number,
      default: 0,
    },
    completedTopics: {
      type: Number,
      default: 0,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const Book = model<IBook>('Book', bookSchema);
