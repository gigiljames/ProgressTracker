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
    const book = await BookModel.findOne({ _id: bookId, userId });
    const sections = await SectionModel.find({ bookId: bookId });
    const chapters = await ChapterModel.find({ bookId: bookId });
    const topics = await TopicModel.find({ bookId: bookId });
    if (!book) {
      throw new CustomError(HTTP_STATUS_CODES.NOT_FOUND, 'Book not found.');
    }
    res.json({ success: true, data: book });
  } catch (e) {
    logger.error('ERROR: getBook');
    next(e);
  }
};

export const createBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new CustomError(
        HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        MESSAGES.AUTH_MIDDLEWARE_ERROR,
      );
    }
    const { title, description, color } = req.body;
    const book = await BookModel.insertOne({
      userId: new mongoose.Types.ObjectId(userId),
      title,
      description,
      color,
    });
    res
      .status(HTTP_STATUS_CODES.CREATED)
      .json({ success: true, message: 'Book created successfully.', data: book });
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
    if (!book) {
      throw new CustomError(HTTP_STATUS_CODES.NOT_FOUND, 'Book not found.');
    }
    // Compare as strings to avoid ObjectId vs string mismatch
    if (book.userId.toString() !== userId) {
      throw new CustomError(HTTP_STATUS_CODES.UNAUTHORIZED, 'This book does not belong to you.');
    }
    const { title, description, color } = req.body;
    await BookModel.findByIdAndUpdate(bookId, { title, description, color });
    res.json({ success: true, message: 'Book edited successfully.' });
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
    if (!book) {
      throw new CustomError(HTTP_STATUS_CODES.NOT_FOUND, 'Book not found.');
    }
    if (book.userId.toString() !== userId) {
      throw new CustomError(HTTP_STATUS_CODES.UNAUTHORIZED, 'This book does not belong to you.');
    }
    // Cascade delete all nested documents
    await TopicModel.deleteMany({ bookId });
    await ChapterModel.deleteMany({ bookId });
    await SectionModel.deleteMany({ bookId });
    await BookModel.findByIdAndDelete(bookId);
    res.json({ success: true, message: 'Book deleted successfully.' });
  } catch (e) {
    logger.error('ERROR: deleteBook');
    next(e);
  }
};
