import { NextFunction, Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { logger } from '../utils/logger';
import { UserModel } from '../models/userModel';
import { CustomError } from '../customError';
import { HTTP_STATUS_CODES } from '../constants/httpStatusCodes';
import { MESSAGES } from '../constants/messages';
import { IOtpEmailTemplate } from '../interfaces/IOtpEmailTemplate';
import { OtpService } from '../services/otpService';
import { EmailService } from '../services/emailService';
import { HashService } from '../services/hashService';
import TokenService from '../services/tokenService';
import { ROLES } from '../enums/roles';

const otpService = new OtpService();
const emailService = new EmailService();
const hashService = new HashService();
const tokenService = new TokenService();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const sendOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // req body validation here
    const { firstName, lastName, email } = req.body;
    const existingUser = await UserModel.findOne({ email: email });
    if (existingUser) {
      throw new CustomError(HTTP_STATUS_CODES.CONFLICT, MESSAGES.USER_ALREADY_EXISTS);
    }
    const otp = otpService.generateOtp(email);
    const emailOptions: IOtpEmailTemplate = {
      email,
      name: `${firstName} ${lastName}`,
      otp,
      subject: 'Study tracker signup OTP',
      body: 'Please enter the above mentioned OTP for verifying your email and completing signup to Study Tracker.',
    };
    await emailService.sendOtp(emailOptions);
    res.json({ success: true, message: 'OTP sent successfully.' });
  } catch (e) {
    logger.error('ERROR: userController - sendOtp');
    next(e);
  }
};

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //req body validation here
    const { firstName, lastName, email, password, otp } = req.body;
    if (otpService.verifyOtp(otp, email)) {
      const passwordHash = await hashService.hash(password);
      await UserModel.insertOne({
        firstName,
        lastName,
        email,
        passwordHash,
        isBlocked: false,
      });
      res.json({ success: true, message: 'Signed up successfully. Log in to continue.' });
    } else {
      throw new CustomError(HTTP_STATUS_CODES.UNAUTHORIZED, MESSAGES.INVALID_OTP);
    }
  } catch (e) {
    logger.error('ERROR: userController - signup');
    next(e);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // req body validation here
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email: email });
    if (!user?.passwordHash) {
      throw new CustomError(HTTP_STATUS_CODES.UNAUTHORIZED, MESSAGES.INCORRECT_AUTH_CREDENTIALS);
    }
    if (user.isBlocked) {
      throw new CustomError(HTTP_STATUS_CODES.FORBIDDEN, MESSAGES.USER_BLOCKED);
    }
    if (user) {
      const verified = await hashService.compare(password!, user.passwordHash);
      if (verified) {
        const { refreshToken } = tokenService.generateRefreshToken({
          userId: user.id,
          role: ROLES.USER,
        });
        // this service also returns tokenId, use if needed
        //store tokenId in cache
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          // secure: process.env.NODE_ENV === 'production',
          secure: true,
          sameSite: 'none',
          path: '/',
          maxAge: 24 * 60 * 60 * 1000,
        });
        const accessToken = tokenService.generateAccessToken({
          userId: user.id,
          role: ROLES.USER,
        });
        res.json({
          success: true,
          data: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            accessToken,
          },
          message: 'Logged in successfully.',
        });
      } else {
        throw new CustomError(HTTP_STATUS_CODES.UNAUTHORIZED, MESSAGES.INCORRECT_AUTH_CREDENTIALS);
      }
    } else {
      throw new CustomError(HTTP_STATUS_CODES.UNAUTHORIZED, MESSAGES.INCORRECT_AUTH_CREDENTIALS);
    }
  } catch (e) {
    logger.error('ERROR: userController - login');
    next(e);
  }
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });
    res.json({ success: true, message: 'Logged out successfully.' });
  } catch (e) {
    logger.error('ERROR: userController - logout');
    next(e);
  }
};

export const refresh = (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies?.refreshToken as string;
    if (!refreshToken) {
      throw new Error("Refresh token doesn't exist");
    }
    const payload = tokenService.verifyRefreshToken(refreshToken);
    // check tokenId in cache
    const accessToken = tokenService.generateAccessToken({
      userId: payload.userId,
      role: payload.role,
    });
    const data = tokenService.generateRefreshToken({
      userId: payload.userId,
      role: payload.role,
    });
    //store tokenId in cache
    res.cookie('refreshToken', data.refreshToken, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === 'production',
      // sameSite: 'strict',
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ success: true, accessToken });
  } catch (error) {
    logger.error('ERROR: userController - refresh');
    next(error);
  }
};

export const googleLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      throw new CustomError(HTTP_STATUS_CODES.BAD_REQUEST, 'Google credential is required.');
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      throw new CustomError(HTTP_STATUS_CODES.UNAUTHORIZED, 'Invalid Google token.');
    }

    const { email, sub: googleId, given_name: firstName, family_name: lastName } = payload;

    let user = await UserModel.findOne({ $or: [{ googleId }, { email }] });

    if (!user) {
      // Create new user
      user = new UserModel({
        firstName: firstName || 'Google',
        lastName: lastName || 'User',
        email,
        googleId,
        isBlocked: false,
      });
      await user.save();
    } else if (!user.googleId) {
      // Link googleId to existing email account
      user.googleId = googleId;
      await user.save();
    }

    if (user.isBlocked) {
      throw new CustomError(HTTP_STATUS_CODES.FORBIDDEN, MESSAGES.USER_BLOCKED);
    }

    const { refreshToken } = tokenService.generateRefreshToken({
      userId: user.id,
      role: ROLES.USER,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === 'production',
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 24 * 60 * 60 * 1000,
    });

    const accessToken = tokenService.generateAccessToken({
      userId: user.id,
      role: ROLES.USER,
    });

    res.json({
      success: true,
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        accessToken,
      },
      message: 'Logged in with Google successfully.',
    });
  } catch (e) {
    logger.error('ERROR: userController - googleLogin');
    next(e);
  }
};
