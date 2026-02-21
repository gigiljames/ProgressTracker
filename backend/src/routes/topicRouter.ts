import { NextFunction, Request, Response, Router } from 'express';
import { ROUTES } from '../constants/routes';
import {
  createTopic,
  deleteTopic,
  editTopic,
  getTopics,
  toggleTopic,
} from '../controllers/topicController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { ROLES } from '../enums/roles';

const topicRouter = Router();

topicRouter.get(
  ROUTES.TOPICS.GET_BY_CHAPTER,
  authMiddleware([ROLES.USER]),
  (req: Request, res: Response, next: NextFunction) => {
    getTopics(req, res, next);
  },
);

topicRouter.post(
  ROUTES.TOPICS.CREATE,
  authMiddleware([ROLES.USER]),
  (req: Request, res: Response, next: NextFunction) => {
    createTopic(req, res, next);
  },
);

topicRouter.patch(
  ROUTES.TOPICS.EDIT,
  authMiddleware([ROLES.USER]),
  (req: Request, res: Response, next: NextFunction) => {
    editTopic(req, res, next);
  },
);

topicRouter.delete(
  ROUTES.TOPICS.DELETE,
  authMiddleware([ROLES.USER]),
  (req: Request, res: Response, next: NextFunction) => {
    deleteTopic(req, res, next);
  },
);

topicRouter.patch(
  ROUTES.TOPICS.TOGGLE,
  authMiddleware([ROLES.USER]),
  (req: Request, res: Response, next: NextFunction) => {
    toggleTopic(req, res, next);
  },
);

export default topicRouter;
