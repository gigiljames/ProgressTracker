import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger';
import { TopicModel } from '../models/topicModel';
import { ChapterModel } from '../models/chapterModel';
import { BookModel } from '../models/bookModel';
import { CustomError } from '../customError';
import { HTTP_STATUS_CODES } from '../constants/httpStatusCodes';
import mongoose from 'mongoose';

export const getTopics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const chapterId = req.params.chapterId;
    const topics = await TopicModel.find({ chapterId });
    res.json({ success: true, data: topics });
  } catch (e) {
    logger.error('ERROR: getTopics');
    next(e);
  }
};

export const createTopic = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    const chapterId = req.params.chapterId;
    const { title, description } = req.body;

    // Look up chapter to get sectionId and bookId for denormalization
    const chapter = await ChapterModel.findById(chapterId);
    if (!chapter) {
      throw new CustomError(HTTP_STATUS_CODES.NOT_FOUND, 'Chapter not found.');
    }

    const topic = await TopicModel.insertOne({
      userId: new mongoose.Types.ObjectId(userId),
      bookId: chapter.bookId,
      sectionId: chapter.sectionId,
      chapterId: chapter._id,
      title,
      description,
    });

    // Increment totalTopics on parent chapter and parent book
    await ChapterModel.findByIdAndUpdate(chapterId, { $inc: { totalTopics: 1 } });
    await BookModel.findByIdAndUpdate(chapter.bookId, { $inc: { totalTopics: 1 } });

    res
      .status(HTTP_STATUS_CODES.CREATED)
      .json({ success: true, message: 'Topic created successfully.', data: topic });
  } catch (e) {
    logger.error('ERROR: createTopic');
    next(e);
  }
};

export const editTopic = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    const topicId = req.params.topicId;
    const topic = await TopicModel.findById(topicId);
    if (!topic) {
      throw new CustomError(HTTP_STATUS_CODES.NOT_FOUND, 'Topic not found.');
    }
    if (topic.userId.toString() !== userId) {
      throw new CustomError(HTTP_STATUS_CODES.UNAUTHORIZED, 'This topic does not belong to you.');
    }
    const { title, description } = req.body;
    await TopicModel.findByIdAndUpdate(topicId, { title, description });
    res.json({ success: true, message: 'Topic edited successfully.' });
  } catch (e) {
    logger.error('ERROR: editTopic');
    next(e);
  }
};

export const deleteTopic = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    const topicId = req.params.topicId;
    const topic = await TopicModel.findById(topicId);
    if (!topic) {
      throw new CustomError(HTTP_STATUS_CODES.NOT_FOUND, 'Topic not found.');
    }
    if (topic.userId.toString() !== userId) {
      throw new CustomError(HTTP_STATUS_CODES.UNAUTHORIZED, 'This topic does not belong to you.');
    }

    await TopicModel.findByIdAndDelete(topicId);

    // Decrement totalTopics (and completedTopics if it was completed) on parent chapter
    await ChapterModel.findByIdAndUpdate(topic.chapterId, {
      $inc: {
        totalTopics: -1,
        completedTopics: topic.isCompleted ? -1 : 0,
      },
    });

    // Decrement on parent book as well
    await BookModel.findByIdAndUpdate(topic.bookId, {
      $inc: {
        totalTopics: -1,
        completedTopics: topic.isCompleted ? -1 : 0,
      },
    });

    res.json({ success: true, message: 'Topic deleted successfully.' });
  } catch (e) {
    logger.error('ERROR: deleteTopic');
    next(e);
  }
};

export const toggleTopic = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    const topicId = req.params.topicId;
    const topic = await TopicModel.findById(topicId);
    if (!topic) {
      throw new CustomError(HTTP_STATUS_CODES.NOT_FOUND, 'Topic not found.');
    }
    if (topic.userId.toString() !== userId) {
      throw new CustomError(HTTP_STATUS_CODES.UNAUTHORIZED, 'This topic does not belong to you.');
    }

    const wasCompleted = topic.isCompleted;
    const nowCompleted = !wasCompleted;
    const delta = nowCompleted ? 1 : -1;

    // Toggle the topic itself
    await TopicModel.findByIdAndUpdate(topicId, {
      isCompleted: nowCompleted,
      completedAt: nowCompleted ? new Date() : null,
    });

    // Update completedTopics count on parent chapter and book
    await ChapterModel.findByIdAndUpdate(topic.chapterId, {
      $inc: { completedTopics: delta },
    });
    await BookModel.findByIdAndUpdate(topic.bookId, {
      $inc: { completedTopics: delta },
    });

    res.json({
      success: true,
      message: `Topic marked as ${nowCompleted ? 'completed' : 'incomplete'}.`,
    });
  } catch (e) {
    logger.error('ERROR: toggleTopic');
    next(e);
  }
};
