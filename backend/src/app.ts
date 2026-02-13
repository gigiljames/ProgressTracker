import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRouter from './routes/userRouter';
import { errorHandlerMiddleware } from './middlewares/errorHandlerMiddleware';
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

// Routes
app.use('/', userRouter);

// Error handler middleware
app.use(errorHandlerMiddleware);

// Server
app.listen(process.env.PORT, () => {
  console.log(`Listening at port - ${process.env.PORT}`);
});
