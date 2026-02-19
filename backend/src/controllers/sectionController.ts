import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger';
import { SectionModel } from '../models/sectionModel';
import { ChapterModel } from '../models/chapterModel';
import { TopicModel } from '../models/topicModel';
import { CustomError } from '../customError';
import { HTTP_STATUS_CODES } from '../constants/httpStatusCodes';
import mongoose from 'mongoose';

export const getSections = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookId = req.params.bookId;
    const sections = await SectionModel.find({ bookId });
    res.json({ success: true, data: sections });
  } catch (e) {
    logger.error('ERROR: getSections');
    next(e);
  }
};

export const createSection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    const bookId = req.params.bookId;
    const { title, description } = req.body;
    const section = await SectionModel.insertOne({
      userId: new mongoose.Types.ObjectId(userId),
      bookId: new mongoose.Types.ObjectId(bookId as string),
      title,
      description,
    });
    res
      .status(HTTP_STATUS_CODES.CREATED)
      .json({ success: true, message: 'Section created successfully.', data: section });
  } catch (e) {
    logger.error('ERROR: createSection');
    next(e);
  }
};

export const editSection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    const sectionId = req.params.sectionId;
    const section = await SectionModel.findById(sectionId);
    if (!section) {
      throw new CustomError(HTTP_STATUS_CODES.NOT_FOUND, 'Section not found.');
    }
    if (section.userId.toString() !== userId) {
      throw new CustomError(HTTP_STATUS_CODES.UNAUTHORIZED, 'This section does not belong to you.');
    }
    const { title, description } = req.body;
    await SectionModel.findByIdAndUpdate(sectionId, { title, description });
    res.json({ success: true, message: 'Section edited successfully.' });
  } catch (e) {
    logger.error('ERROR: editSection');
    next(e);
  }
};

export const deleteSection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    const sectionId = req.params.sectionId;
    const section = await SectionModel.findById(sectionId);
    if (!section) {
      throw new CustomError(HTTP_STATUS_CODES.NOT_FOUND, 'Section not found.');
    }
    if (section.userId.toString() !== userId) {
      throw new CustomError(HTTP_STATUS_CODES.UNAUTHORIZED, 'This section does not belong to you.');
    }
    // Cascade delete chapters and topics belonging to this section
    await TopicModel.deleteMany({ sectionId });
    await ChapterModel.deleteMany({ sectionId });
    await SectionModel.findByIdAndDelete(sectionId);
    res.json({ success: true, message: 'Section deleted successfully.' });
  } catch (e) {
    logger.error('ERROR: deleteSection');
    next(e);
  }
};
