import { Schema, model, Document, Types } from 'mongoose';

export interface IChapter extends Document {
  userId: Types.ObjectId;
  bookId: Types.ObjectId;
  sectionId: Types.ObjectId;
  title: string;
  description: string;
  totalTopics: number;
  completedTopics: number;
  createdAt: Date;
  updatedAt: Date;
}

const chapterSchema = new Schema<IChapter>(
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
    sectionId: {
      type: Schema.Types.ObjectId,
      ref: 'Section',
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
    totalTopics: {
      type: Number,
      default: 0,
    },
    completedTopics: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export const ChapterModel = model<IChapter>('Chapter', chapterSchema);
