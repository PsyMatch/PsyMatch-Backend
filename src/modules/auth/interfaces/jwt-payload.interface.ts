import { ERole } from '../../users/enums/role.enum';

export interface IJwtPayload {
  id: string;
  email: string;
  role: ERole;
  iat: string;
  exp: string;
}
