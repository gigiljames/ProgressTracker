import { NextFunction, Request, Response, Router } from 'express';
import { ROUTES } from '../constants/routes';
import { authMiddleware } from '../middlewares/authMiddleware';
import { ROLES } from '../enums/roles';
import {
  createSlot,
  deleteSlot,
  editSlot,
  getSlots,
  addTask,
  editTask,
  deleteTask,
  toggleTask,
} from '../controllers/slotController';

const slotRouter = Router();

// Slot CRUD
slotRouter.get(
  ROUTES.DASHBOARD.GET_SLOTS,
  authMiddleware([ROLES.USER]),
  (req: Request, res: Response, next: NextFunction) => {
    getSlots(req, res, next);
  },
);
slotRouter.post(
  ROUTES.DASHBOARD.CREATE_SLOT,
  authMiddleware([ROLES.USER]),
  (req: Request, res: Response, next: NextFunction) => {
    createSlot(req, res, next);
  },
);
slotRouter.patch(
  ROUTES.DASHBOARD.EDIT_SLOT,
  authMiddleware([ROLES.USER]),
  (req: Request, res: Response, next: NextFunction) => {
    editSlot(req, res, next);
  },
);
slotRouter.delete(
  ROUTES.DASHBOARD.DELETE_SLOT,
  authMiddleware([ROLES.USER]),
  (req: Request, res: Response, next: NextFunction) => {
    deleteSlot(req, res, next);
  },
);

// Task CRUD
slotRouter.post(
  ROUTES.TASKS.ADD_TASK,
  authMiddleware([ROLES.USER]),
  (req: Request, res: Response, next: NextFunction) => {
    addTask(req, res, next);
  },
);
slotRouter.patch(
  ROUTES.TASKS.EDIT_TASK,
  authMiddleware([ROLES.USER]),
  (req: Request, res: Response, next: NextFunction) => {
    editTask(req, res, next);
  },
);
slotRouter.delete(
  ROUTES.TASKS.DELETE_TASK,
  authMiddleware([ROLES.USER]),
  (req: Request, res: Response, next: NextFunction) => {
    deleteTask(req, res, next);
  },
);
slotRouter.patch(
  ROUTES.TASKS.TOGGLE_TASK,
  authMiddleware([ROLES.USER]),
  (req: Request, res: Response, next: NextFunction) => {
    toggleTask(req, res, next);
  },
);

export default slotRouter;
