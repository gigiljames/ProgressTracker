import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRouter from './routes/userRouter';
import { errorHandlerMiddleware } from './middlewares/errorHandlerMiddleware';
import mongoose from 'mongoose';
import { loggerMiddleware } from './middlewares/loggerMiddleware';
import bookRouter from './routes/bookRouter';
import chapterRouter from './routes/chapterRouter';
import examRouter from './routes/examRouter';
import sectionRouter from './routes/sectionRouter';
import slotRouter from './routes/slotRouter';
import topicRouter from './routes/topicRouter';
dotenv.config();

const app = express();

// Middlewares
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(loggerMiddleware);

// Routes
app.use('/', userRouter);
app.use('/', bookRouter);
app.use('/', chapterRouter);
app.use('/', examRouter);
app.use('/', sectionRouter);
app.use('/', slotRouter);
app.use('/', topicRouter);

// Error handler middleware
app.use(errorHandlerMiddleware);

// Server
app.listen(process.env.PORT, () => {
  const mongoUrl = process.env.MONGODB_URL;
  if (!mongoUrl) {
    throw new Error('MongoDB URL not found.');
  }
  mongoose.connect(mongoUrl);
  console.log('MongoDB connected.');
  console.log(`Listening at port - ${process.env.PORT}`);
});
