import { NextFunction, Request, Response, Router } from 'express';
import { ROUTES } from '../constants/routes';
import { authMiddleware } from '../middlewares/authMiddleware';
import { ROLES } from '../enums/roles';
import {
  createChapter,
  deleteChapter,
  editChapter,
  getChapters,
} from '../controllers/chapterController';

const chapterRouter = Router();

chapterRouter.get(
  ROUTES.CHAPTERS.GET_BY_SECTION,
  authMiddleware([ROLES.USER]),
  (req: Request, res: Response, next: NextFunction) => {
    getChapters(req, res, next);
  },
);

chapterRouter.post(
  ROUTES.CHAPTERS.CREATE,
  authMiddleware([ROLES.USER]),
  (req: Request, res: Response, next: NextFunction) => {
    createChapter(req, res, next);
  },
);

chapterRouter.patch(
  ROUTES.CHAPTERS.EDIT,
  authMiddleware([ROLES.USER]),
  (req: Request, res: Response, next: NextFunction) => {
    editChapter(req, res, next);
  },
);

chapterRouter.delete(
  ROUTES.CHAPTERS.DELETE,
  authMiddleware([ROLES.USER]),
  (req: Request, res: Response, next: NextFunction) => {
    deleteChapter(req, res, next);
  },
);

export default chapterRouter;
