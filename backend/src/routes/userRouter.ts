import { Router } from 'express';
import { ROUTES } from '../constants/routes';

const userRouter = Router();

userRouter.get(ROUTES.AUTH.LOGIN, (req, res) => {});

export default userRouter;
