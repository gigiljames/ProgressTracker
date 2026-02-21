import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../constants/httpStatusCodes';
import { devLogger, productionLogger } from '../utils/logger';
import { CustomError } from '../customError';

export function errorHandlerMiddleware(
  err: Error | CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  void next;
  const statusCode =
    err instanceof CustomError ? err.statusCode : HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
  if (process.env.NODE_ENV === 'production') {
    productionLogger.error(err.message || 'Something went wrong.');
    productionLogger.error(err.stack || 'Stack trace not available.');
  } else {
    devLogger.error(err.message || 'Something went wrong.');
    devLogger.error(err.stack || 'Stack trace not available.');
  }
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Something went wrong.',
  });
}
