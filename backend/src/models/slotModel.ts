import { Schema, model, Document, Types } from 'mongoose';

interface ISlotTask {
  _id?: Types.ObjectId;
  type: 'TEXTBOOK' | 'CUSTOM';
  topicId?: Types.ObjectId;
  titleSnapshot: string;
  description: string;
  isCompleted: boolean;
  completedAt?: Date | null;
}

export interface IDailySlot extends Document {
  userId: Types.ObjectId;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string;
  title: string;
  description: string;
  tasks: ISlotTask[];
  totalTasks: number;
  completedTasks: number;
  createdAt: Date;
  updatedAt: Date;
}

const slotTaskSchema = new Schema<ISlotTask>(
  {
    type: {
      type: String,
      enum: ['TEXTBOOK', 'CUSTOM'],
      required: true,
    },
    topicId: {
      type: Schema.Types.ObjectId,
    },
    titleSnapshot: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { _id: true },
);

const dailySlotSchema = new Schema<IDailySlot>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    tasks: {
      type: [slotTaskSchema],
      default: [],
    },
    totalTasks: {
      type: Number,
      default: 0,
    },
    completedTasks: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

dailySlotSchema.index({ userId: 1, date: 1, startTime: 1 });

export const DailySlot = model<IDailySlot>('DailySlot', dailySlotSchema);
