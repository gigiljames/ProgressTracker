import { ROLES } from '../enums/roles';

export interface IAccessTokenData {
  userId: string;
  role: ROLES;
}
