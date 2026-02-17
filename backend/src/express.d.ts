import { IAccessTokenData } from './interfaces/IAccessTokenData';

declare module 'express-serve-static-core' {
  interface Request {
    user?: IAccessTokenData;
  }
}
