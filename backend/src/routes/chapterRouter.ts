import { Router } from 'express';
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
  (req, res, next) => {
    getChapters(req, res, next);
  },
);

chapterRouter.post(ROUTES.CHAPTERS.CREATE, authMiddleware([ROLES.USER]), (req, res, next) => {
  createChapter(req, res, next);
});

chapterRouter.patch(ROUTES.CHAPTERS.EDIT, authMiddleware([ROLES.USER]), (req, res, next) => {
  editChapter(req, res, next);
});

chapterRouter.delete(ROUTES.CHAPTERS.DELETE, authMiddleware([ROLES.USER]), (req, res, next) => {
  deleteChapter(req, res, next);
});

export default chapterRouter;
