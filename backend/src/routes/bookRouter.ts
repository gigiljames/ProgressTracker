import { NextFunction, Request, Response, Router } from 'express';
import { ROUTES } from '../constants/routes';
import { authMiddleware } from '../middlewares/authMiddleware';
import { ROLES } from '../enums/roles';
import { createBook, deleteBook, editBook, getBook, getBooks } from '../controllers/bookController';

const bookRouter = Router();

bookRouter.get(
  ROUTES.BOOKS.GET_ALL,
  authMiddleware([ROLES.USER]),
  (req: Request, res: Response, next: NextFunction) => {
    getBooks(req, res, next);
  },
);

bookRouter.get(
  ROUTES.BOOKS.GET_ONE,
  authMiddleware([ROLES.USER]),
  (req: Request, res: Response, next: NextFunction) => {
    getBook(req, res, next);
  },
);

bookRouter.post(
  ROUTES.BOOKS.CREATE,
  authMiddleware([ROLES.USER]),
  (req: Request, res: Response, next: NextFunction) => {
    createBook(req, res, next);
  },
);

bookRouter.patch(
  ROUTES.BOOKS.EDIT,
  authMiddleware([ROLES.USER]),
  (req: Request, res: Response, next: NextFunction) => {
    editBook(req, res, next);
  },
);

bookRouter.delete(
  ROUTES.BOOKS.DELETE,
  authMiddleware([ROLES.USER]),
  (req: Request, res: Response, next: NextFunction) => {
    deleteBook(req, res, next);
  },
);

export default bookRouter;
