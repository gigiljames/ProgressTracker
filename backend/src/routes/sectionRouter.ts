import { NextFunction, Request, Response, Router } from 'express';
import { ROUTES } from '../constants/routes';
import { authMiddleware } from '../middlewares/authMiddleware';
import { ROLES } from '../enums/roles';
import {
  createSection,
  deleteSection,
  editSection,
  getSections,
} from '../controllers/sectionController';

const sectionRouter = Router();

sectionRouter.get(
  ROUTES.SECTIONS.GET_BY_BOOK,
  authMiddleware([ROLES.USER]),
  (req: Request, res: Response, next: NextFunction) => {
    getSections(req, res, next);
  },
);

sectionRouter.post(
  ROUTES.SECTIONS.CREATE,
  authMiddleware([ROLES.USER]),
  (req: Request, res: Response, next: NextFunction) => {
    createSection(req, res, next);
  },
);

sectionRouter.patch(
  ROUTES.SECTIONS.EDIT,
  authMiddleware([ROLES.USER]),
  (req: Request, res: Response, next: NextFunction) => {
    editSection(req, res, next);
  },
);

sectionRouter.delete(
  ROUTES.SECTIONS.DELETE,
  authMiddleware([ROLES.USER]),
  (req: Request, res: Response, next: NextFunction) => {
    deleteSection(req, res, next);
  },
);

export default sectionRouter;
