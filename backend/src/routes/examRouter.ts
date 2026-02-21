import { NextFunction, Request, Response, Router } from 'express';
import { ROUTES } from '../constants/routes';
import { authMiddleware } from '../middlewares/authMiddleware';
import { ROLES } from '../enums/roles';
import { createExam, deleteExam, editExam, getExams } from '../controllers/examController';

const examRouter = Router();

examRouter.get(
  ROUTES.EXAMS.GET_ALL,
  authMiddleware([ROLES.USER]),
  (req: Request, res: Response, next: NextFunction) => {
    getExams(req, res, next);
  },
);

examRouter.post(
  ROUTES.EXAMS.CREATE,
  authMiddleware([ROLES.USER]),
  (req: Request, res: Response, next: NextFunction) => {
    createExam(req, res, next);
  },
);

examRouter.patch(
  ROUTES.EXAMS.EDIT,
  authMiddleware([ROLES.USER]),
  (req: Request, res: Response, next: NextFunction) => {
    editExam(req, res, next);
  },
);

examRouter.delete(
  ROUTES.EXAMS.DELETE,
  authMiddleware([ROLES.USER]),
  (req: Request, res: Response, next: NextFunction) => {
    deleteExam(req, res, next);
  },
);

export default examRouter;
