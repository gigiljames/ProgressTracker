import { Router } from 'express';
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
slotRouter.get(ROUTES.DASHBOARD.GET_SLOTS, authMiddleware([ROLES.USER]), getSlots);
slotRouter.post(ROUTES.DASHBOARD.CREATE_SLOT, authMiddleware([ROLES.USER]), createSlot);
slotRouter.patch(ROUTES.DASHBOARD.EDIT_SLOT, authMiddleware([ROLES.USER]), editSlot);
slotRouter.delete(ROUTES.DASHBOARD.DELETE_SLOT, authMiddleware([ROLES.USER]), deleteSlot);

// Task CRUD
slotRouter.post(ROUTES.TASKS.ADD_TASK, authMiddleware([ROLES.USER]), addTask);
slotRouter.patch(ROUTES.TASKS.EDIT_TASK, authMiddleware([ROLES.USER]), editTask);
slotRouter.delete(ROUTES.TASKS.DELETE_TASK, authMiddleware([ROLES.USER]), deleteTask);
slotRouter.patch(ROUTES.TASKS.TOGGLE_TASK, authMiddleware([ROLES.USER]), toggleTask);

export default slotRouter;
