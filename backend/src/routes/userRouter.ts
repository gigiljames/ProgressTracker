import { Router } from 'express';
import { ROUTES } from '../constants/routes';
import { login, logout, refresh, sendOtp, signup } from '../controllers/userController';

const userRouter = Router();

userRouter.post(ROUTES.AUTH.LOGIN, (req, res, next) => {
  login(req, res, next);
});

userRouter.post(ROUTES.AUTH.LOGOUT, (req, res, next) => {
  logout(req, res, next);
});

userRouter.post(ROUTES.AUTH.SEND_OTP, (req, res, next) => {
  sendOtp(req, res, next);
});

userRouter.post(ROUTES.AUTH.SIGNUP, (req, res, next) => {
  signup(req, res, next);
});

userRouter.get(ROUTES.AUTH.REFRESH_TOKEN, (req, res, next) => {
  refresh(req, res, next);
});

export default userRouter;
