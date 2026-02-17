import { Router } from 'express';
import { ROUTES } from '../constants/routes';
import { authMiddleware } from '../middlewares/authMiddleware';
import { ROLES } from '../enums/roles';
import { createSlot, deleteSlot, editSlot, getSlots } from '../controllers/slotController';

const slotRouter = Router();

slotRouter.get(ROUTES.DASHBOARD.GET_SLOTS, authMiddleware([ROLES.USER]), (req, res, next) => {
  getSlots(req, res, next);
});

slotRouter.post(ROUTES.DASHBOARD.CREATE_SLOT, authMiddleware([ROLES.USER]), (req, res, next) => {
  createSlot(req, res, next);
});

slotRouter.patch(ROUTES.DASHBOARD.EDIT_SLOT, authMiddleware([ROLES.USER]), (req, res, next) => {
  editSlot(req, res, next);
});

slotRouter.delete(ROUTES.DASHBOARD.DELETE_SLOT, authMiddleware([ROLES.USER]), (req, res, next) => {
  deleteSlot(req, res, next);
});

export default slotRouter;
