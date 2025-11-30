import { Role } from '../../../common/constants/roles.constant';

export interface TokenPayload {
  sub: string; // userId
  role: Role;
  type: string;
}