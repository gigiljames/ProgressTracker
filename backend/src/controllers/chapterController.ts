import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger';
import { ChapterModel } from '../models/chapterModel';
import { TopicModel } from '../models/topicModel';
import { SectionModel } from '../models/sectionModel';
import { CustomError } from '../customError';
import { HTTP_STATUS_CODES } from '../constants/httpStatusCodes';
import mongoose from 'mongoose';

export const getChapters = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sectionId = req.params.sectionId;
    const chapters = await ChapterModel.find({ sectionId });
    res.json({ success: true, data: chapters });
  } catch (e) {
    logger.error('ERROR: getChapters');
    next(e);
  }
};

export const createChapter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    const sectionId = req.params.sectionId;
    const { title, description } = req.body;

    // Look up the section to get bookId for denormalization
    const section = await SectionModel.findById(sectionId);
    if (!section) {
      throw new CustomError(HTTP_STATUS_CODES.NOT_FOUND, 'Section not found.');
    }

    const chapter = await ChapterModel.insertOne({
      userId: new mongoose.Types.ObjectId(userId),
      bookId: section.bookId,
      sectionId: section._id,
      title,
      description,
    });
    // Increment totalChapters on parent section
    await SectionModel.findByIdAndUpdate(sectionId, { $inc: { totalChapters: 1 } });
    res
      .status(HTTP_STATUS_CODES.CREATED)
      .json({ success: true, message: 'Chapter created successfully.', data: chapter });
  } catch (e) {
    logger.error('ERROR: createChapter');
    next(e);
  }
};

export const editChapter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    const chapterId = req.params.chapterId;
    const chapter = await ChapterModel.findById(chapterId);
    if (!chapter) {
      throw new CustomError(HTTP_STATUS_CODES.NOT_FOUND, 'Chapter not found.');
    }
    if (chapter.userId.toString() !== userId) {
      throw new CustomError(HTTP_STATUS_CODES.UNAUTHORIZED, 'This chapter does not belong to you.');
    }
    const { title, description } = req.body;
    await ChapterModel.findByIdAndUpdate(chapterId, { title, description });
    res.json({ success: true, message: 'Chapter edited successfully.' });
  } catch (e) {
    logger.error('ERROR: editChapter');
    next(e);
  }
};

export const deleteChapter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    const chapterId = req.params.chapterId;
    const chapter = await ChapterModel.findById(chapterId);
    if (!chapter) {
      throw new CustomError(HTTP_STATUS_CODES.NOT_FOUND, 'Chapter not found.');
    }
    if (chapter.userId.toString() !== userId) {
      throw new CustomError(HTTP_STATUS_CODES.UNAUTHORIZED, 'This chapter does not belong to you.');
    }

    // Count completed topics to decrement parent counts correctly
    const completedTopicsCount = await TopicModel.countDocuments({ chapterId, isCompleted: true });

    // Cascade delete topics
    await TopicModel.deleteMany({ chapterId });
    await ChapterModel.findByIdAndDelete(chapterId);

    // Update parent section counts
    await SectionModel.findByIdAndUpdate(chapter.sectionId, {
      $inc: {
        totalChapters: -1,
        completedChapters:
          chapter.completedTopics === chapter.totalTopics && chapter.totalTopics > 0 ? -1 : 0,
      },
    });

    // Update parent book topic counts
    const { BookModel } = await import('../models/bookModel');
    await BookModel.findByIdAndUpdate(chapter.bookId, {
      $inc: {
        totalTopics: -chapter.totalTopics,
        completedTopics: -completedTopicsCount,
      },
    });

    res.json({ success: true, message: 'Chapter deleted successfully.' });
  } catch (e) {
    logger.error('ERROR: deleteChapter');
    next(e);
  }
};
