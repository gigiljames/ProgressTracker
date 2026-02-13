import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { IAccessTokenData } from '../interfaces/IAccessTokenData';
import { IRefreshTokenData } from '../interfaces/IRefreshTokenData';

export default class TokenService {
  private readonly _accessTokenSecret: string;
  private readonly _refreshTokenSecret: string;
  constructor() {
    if (!process.env.ACCESS_TOKEN_SECRET) {
      throw new Error('Access token secret not found');
    }
    if (!process.env.REFRESH_TOKEN_SECRET) {
      throw new Error('Refresh token secret not found.');
    }
    this._accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    this._refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
  }
  generateAccessToken(data: IAccessTokenData): string {
    return jwt.sign(data, this._accessTokenSecret, {
      expiresIn: '10s',
    });
  }

  verifyAccessToken(token: string): IAccessTokenData {
    return jwt.verify(token, this._accessTokenSecret) as IAccessTokenData;
  }

  generateRefreshToken(data: IRefreshTokenData): { tokenId: string; refreshToken: string } {
    const tokenId = uuidv4();
    const refreshToken = jwt.sign(data, this._refreshTokenSecret, {
      expiresIn: '1d',
    });
    return { tokenId, refreshToken };
  }

  verifyRefreshToken(token: string): IRefreshTokenData {
    return jwt.verify(token, this._refreshTokenSecret) as IRefreshTokenData;
  }
}
