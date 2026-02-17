import { Schema, model, Document, Types } from 'mongoose';

export interface IExam extends Document {
  userId: Types.ObjectId;
  title: string;
  description?: string;
  examDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const examSchema = new Schema<IExam>(
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
    examDate: {
      type: Date,
      required: true,
      index: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true },
);

examSchema.index({ userId: 1, examDate: 1 });

export const ExamModel = model<IExam>('Exam', examSchema);
