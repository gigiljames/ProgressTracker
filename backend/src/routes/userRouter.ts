import { Router } from 'express';
import { ROUTES } from '../constants/routes';

const userRouter = Router();

userRouter.post(ROUTES.AUTH.LOGIN, (req, res) => {
  console.log('Login');
  console.log(req.body);
});

export default userRouter;
