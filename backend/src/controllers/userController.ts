import { NextFunction, Request, Response } from 'express';

export const sendOtp = (req: Request, res: Response, next: NextFunction) => {};

export const signup = (req: Request, res: Response, next: NextFunction) => {};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
};

export const logout = (req: Request, res: Response, next: NextFunction) => {};

export const refresh = (req: Request, res: Response, next: NextFunction) => {};
