import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger';
import { BookModel } from '../models/bookModel';
import { SectionModel } from '../models/sectionModel';
import { ChapterModel } from '../models/chapterModel';
import { TopicModel } from '../models/topicModel';
import { CustomError } from '../customError';
import { HTTP_STATUS_CODES } from '../constants/httpStatusCodes';
import { MESSAGES } from '../constants/messages';
import mongoose from 'mongoose';

export const getBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    const books = await BookModel.find({ userId: userId });
    res.json({ success: true, data: books });
  } catch (e) {
    logger.error('ERROR: getBooks');
    next(e);
  }
};

export const getBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    const bookId = req.params.bookId;
    const book = await BookModel.findById(bookId);
    const sections = await SectionModel.find({ bookId: bookId });
    const chapters = await ChapterModel.find({ bookId: bookId });
    const topics = await TopicModel.find({ bookId: bookId });
  } catch (e) {
    logger.error('ERROR: getBook');
    next(e);
  }
};

export const createBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookId = req.params.bookId;
    const userId = req.user?.userId;
    if (!userId) {
      throw new CustomError(
        HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        MESSAGES.AUTH_MIDDLEWARE_ERROR,
      );
    }
    // req body validation here
    const { title, desc, color } = req.body;
    await BookModel.insertOne({
      userId: new mongoose.Types.ObjectId(userId),
      title: title,
      description: desc,
      color: color,
    });
    res.json({ success: true, message: 'Book created successfully' });
  } catch (e) {
    logger.error('ERROR: createBook');
    next(e);
  }
};

export const editBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookId = req.params.bookId;
    const userId = req.user?.userId;
    const book = await BookModel.findById(bookId);
    if (book?.userId !== userId) {
      throw new CustomError(HTTP_STATUS_CODES.UNAUTHORIZED, 'This book does not belong to you');
    }
    // req body validation here
    const { title, desc, color } = req.body;
    await BookModel.findByIdAndUpdate(bookId, {
      title: title,
      description: desc,
      color: color,
    });
    res.json({ success: true, message: 'Book edited successfully' });
  } catch (e) {
    logger.error('ERROR: editBook');
    next(e);
  }
};

export const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookId = req.params.bookId;
    const userId = req.user?.userId;
    const book = await BookModel.findById(bookId);
    if (book?.userId !== userId) {
      throw new CustomError(HTTP_STATUS_CODES.UNAUTHORIZED, 'This book does not belong to you');
    }
    await BookModel.findByIdAndDelete(bookId);
    res.json({ success: true, message: 'Book deleted successfully' });
  } catch (e) {
    logger.error('ERROR: ');
    next(e);
  }
};
