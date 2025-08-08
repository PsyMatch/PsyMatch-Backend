import { Request } from 'express';
import { IJwtPayload } from './jwt-payload.interface';

export interface IAuthRequest extends Request {
  user: IJwtPayload;
  tokenExpiresAt: string;
}
