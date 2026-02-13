import { NextFunction, Request, Response } from 'express';
import { ROLES } from '../enums/roles';
import { MESSAGES } from '../constants/messages';
import { HTTP_STATUS_CODES } from '../constants/httpStatusCodes';
import { logger } from '../utils/logger';
import TokenService from '../services/tokenService';

export function authMiddleware(allowedRoles: ROLES[]) {
  return function (req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const tokenService = new TokenService();
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const data = tokenService.verifyAccessToken(token);
        req.user = data;
        const role = data.role;
        if (!allowedRoles.includes(role)) {
          return res.status(403).json({ success: false, message: MESSAGES.UNAUTHORIZED });
        } else {
          next();
        }
      } catch (error) {
        logger.error('ERROR: Auth Middleware.');
        logger.error(error);
        res
          .status(HTTP_STATUS_CODES.UNAUTHORIZED)
          .json({ success: false, message: MESSAGES.UNAUTHORIZED });
      }
    } else {
      return res
        .status(HTTP_STATUS_CODES.UNAUTHORIZED)
        .json({ success: false, message: MESSAGES.UNAUTHORIZED });
    }
  };
}
