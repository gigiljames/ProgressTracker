import { NextFunction, Request, Response, Router } from 'express';
import { ROUTES } from '../constants/routes';
import { login, logout, refresh, sendOtp, signup } from '../controllers/userController';

const userRouter = Router();

userRouter.post(ROUTES.AUTH.LOGIN, (req: Request, res: Response, next: NextFunction) => {
  login(req, res, next);
});

userRouter.post(ROUTES.AUTH.LOGOUT, (req: Request, res: Response, next: NextFunction) => {
  logout(req, res, next);
});

userRouter.post(ROUTES.AUTH.SEND_OTP, (req: Request, res: Response, next: NextFunction) => {
  sendOtp(req, res, next);
});

userRouter.post(ROUTES.AUTH.SIGNUP, (req: Request, res: Response, next: NextFunction) => {
  signup(req, res, next);
});

userRouter.get(ROUTES.AUTH.REFRESH_TOKEN, (req: Request, res: Response, next: NextFunction) => {
  refresh(req, res, next);
});

export default userRouter;
