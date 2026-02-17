import { Schema, model, Document, Types } from 'mongoose';

export interface ISection extends Document {
  userId: Types.ObjectId;
  bookId: Types.ObjectId;
  title: string;
  description: string;
  totalChapters: number;
  completedChapters: number;
  createdAt: Date;
  updatedAt: Date;
}

const sectionSchema = new Schema<ISection>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bookId: {
      type: Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    totalChapters: {
      type: Number,
      default: 0,
    },
    completedChapters: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export const SectionModel = model<ISection>('Section', sectionSchema);
