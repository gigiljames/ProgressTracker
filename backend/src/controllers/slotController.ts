import { NextFunction, Request, Response } from 'express';
import { DailySlotModel } from '../models/slotModel';
import { CustomError } from '../customError';
import { HTTP_STATUS_CODES } from '../constants/httpStatusCodes';
import mongoose from 'mongoose';

// ── Overlap helper ────────────────────────────────────────────────────────────
// Returns true if [s1,e1) overlaps [s2,e2) (HH:mm strings, lexicographic compare)
function overlaps(s1: string, e1: string, s2: string, e2: string): boolean {
  return s1 < e2 && s2 < e1;
}

// ── Ownership guard ───────────────────────────────────────────────────────────
async function requireSlot(slotId: string, userId: string) {
  const slot = await DailySlotModel.findById(slotId);
  if (!slot) throw new CustomError(HTTP_STATUS_CODES.NOT_FOUND, 'Slot not found.');
  if (slot.userId.toString() !== userId)
    throw new CustomError(HTTP_STATUS_CODES.FORBIDDEN, 'Access denied.');
  return slot;
}

// ═════════════════════════════════════════════════════════════════════════════
// SLOTS
// ═════════════════════════════════════════════════════════════════════════════

export const getSlots = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    const { date } = req.query;

    const filter: Record<string, unknown> = {
      userId: new mongoose.Types.ObjectId(userId),
    };
    if (date) filter.date = date;

    const slots = await DailySlotModel.find(filter).sort({ date: 1, startTime: 1 });
    res.json({ success: true, data: slots });
  } catch (err) {
    next(err);
  }
};

export const createSlot = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    const { date, startTime, endTime, title, description } = req.body;

    if (!date || !startTime || !endTime || !title) {
      throw new CustomError(
        HTTP_STATUS_CODES.BAD_REQUEST,
        'date, startTime, endTime and title are required.',
      );
    }
    if (startTime >= endTime) {
      throw new CustomError(HTTP_STATUS_CODES.BAD_REQUEST, 'startTime must be before endTime.');
    }

    // Overlap check
    const existing = await DailySlotModel.find({
      userId: new mongoose.Types.ObjectId(userId),
      date,
    });
    const conflict = existing.find((s) => overlaps(startTime, endTime, s.startTime, s.endTime));
    if (conflict) {
      throw new CustomError(
        HTTP_STATUS_CODES.CONFLICT,
        `This slot overlaps with "${conflict.title}" (${conflict.startTime}–${conflict.endTime}).`,
      );
    }

    const slot = await DailySlotModel.create({
      userId: new mongoose.Types.ObjectId(userId),
      date,
      startTime,
      endTime,
      title,
      description: description ?? '',
    });

    res.status(HTTP_STATUS_CODES.CREATED).json({
      success: true,
      message: 'Slot created successfully.',
      data: slot,
    });
  } catch (err) {
    next(err);
  }
};

export const editSlot = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    const { slotId } = req.params;
    const { date, startTime, endTime, title, description } = req.body;

    const slot = await requireSlot(slotId as string, userId!);

    const effectiveDate = date ?? slot.date;
    const effectiveStart = startTime ?? slot.startTime;
    const effectiveEnd = endTime ?? slot.endTime;

    if (effectiveStart >= effectiveEnd) {
      throw new CustomError(HTTP_STATUS_CODES.BAD_REQUEST, 'startTime must be before endTime.');
    }

    // Overlap check (exclude self)
    const existing = await DailySlotModel.find({
      userId: new mongoose.Types.ObjectId(userId),
      date: effectiveDate,
      _id: { $ne: new mongoose.Types.ObjectId(slotId as string) },
    });
    const conflict = existing.find((s) =>
      overlaps(effectiveStart, effectiveEnd, s.startTime, s.endTime),
    );
    if (conflict) {
      throw new CustomError(
        HTTP_STATUS_CODES.CONFLICT,
        `This slot overlaps with "${conflict.title}" (${conflict.startTime}–${conflict.endTime}).`,
      );
    }

    const updates: Record<string, unknown> = {};
    if (date !== undefined) updates.date = date;
    if (startTime !== undefined) updates.startTime = startTime;
    if (endTime !== undefined) updates.endTime = endTime;
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;

    const updated = await DailySlotModel.findByIdAndUpdate(
      slotId,
      { $set: updates },
      { new: true },
    );

    res.json({ success: true, message: 'Slot updated successfully.', data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteSlot = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    const { slotId } = req.params;

    await requireSlot(slotId as string, userId!);
    await DailySlotModel.findByIdAndDelete(slotId);

    res.json({ success: true, message: 'Slot deleted.' });
  } catch (err) {
    next(err);
  }
};

// ═════════════════════════════════════════════════════════════════════════════
// TASKS
// ═════════════════════════════════════════════════════════════════════════════

export const addTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    const { slotId } = req.params;
    const { type, topicId, titleSnapshot, description } = req.body;

    if (!type || !['TEXTBOOK', 'CUSTOM'].includes(type)) {
      throw new CustomError(HTTP_STATUS_CODES.BAD_REQUEST, 'type must be TEXTBOOK or CUSTOM.');
    }
    if (!titleSnapshot) {
      throw new CustomError(HTTP_STATUS_CODES.BAD_REQUEST, 'titleSnapshot is required.');
    }
    if (type === 'TEXTBOOK' && !topicId) {
      throw new CustomError(
        HTTP_STATUS_CODES.BAD_REQUEST,
        'topicId is required for TEXTBOOK tasks.',
      );
    }

    const slot = await requireSlot(slotId as string, userId!);

    const task = {
      type,
      topicId: topicId ? new mongoose.Types.ObjectId(topicId) : undefined,
      titleSnapshot,
      description: description ?? '',
      isCompleted: false,
      completedAt: null,
    };

    slot.tasks.push(task as any);
    slot.totalTasks = slot.tasks.length;
    await slot.save();

    const newTask = slot.tasks[slot.tasks.length - 1];
    res.status(HTTP_STATUS_CODES.CREATED).json({
      success: true,
      message: 'Task added.',
      data: { slot, task: newTask },
    });
  } catch (err) {
    next(err);
  }
};

export const editTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    const { slotId, taskId } = req.params;
    const { titleSnapshot, description } = req.body;

    const slot = await requireSlot(slotId as string, userId!);
    const task = slot.tasks.find((t) => t._id?.toString() === taskId);
    if (!task) throw new CustomError(HTTP_STATUS_CODES.NOT_FOUND, 'Task not found.');

    if (titleSnapshot !== undefined) task.titleSnapshot = titleSnapshot;
    if (description !== undefined) task.description = description;

    await slot.save();
    res.json({ success: true, message: 'Task updated.', data: slot });
  } catch (err) {
    next(err);
  }
};

export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    const { slotId, taskId } = req.params;

    const slot = await requireSlot(slotId as string, userId!);
    const idx = slot.tasks.findIndex((t) => t._id?.toString() === taskId);
    if (idx === -1) throw new CustomError(HTTP_STATUS_CODES.NOT_FOUND, 'Task not found.');

    const wasCompleted = slot.tasks[idx].isCompleted;
    slot.tasks.splice(idx, 1);
    slot.totalTasks = slot.tasks.length;
    if (wasCompleted) slot.completedTasks = Math.max(0, slot.completedTasks - 1);

    await slot.save();
    res.json({ success: true, message: 'Task deleted.', data: slot });
  } catch (err) {
    next(err);
  }
};

export const toggleTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    const { slotId, taskId } = req.params;

    const slot = await requireSlot(slotId as string, userId!);
    const task = slot.tasks.find((t) => t._id?.toString() === taskId);
    if (!task) throw new CustomError(HTTP_STATUS_CODES.NOT_FOUND, 'Task not found.');

    task.isCompleted = !task.isCompleted;
    task.completedAt = task.isCompleted ? new Date() : null;
    slot.completedTasks = slot.tasks.filter((t) => t.isCompleted).length;

    await slot.save();
    res.json({ success: true, message: 'Task toggled.', data: slot });
  } catch (err) {
    next(err);
  }
};
