import { Request } from 'express';
import { ERole } from '../../../common/enums/role.enum';

export interface AuthUser {
  sub?: string;
  id?: string;
  role?: ERole;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}
