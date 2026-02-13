import { ROLES } from '../enums/roles';

export interface IRefreshTokenData {
  userId: string;
  role: ROLES;
}
