import { SetMetadata } from '@nestjs/common';
import { ClassConstructor } from 'class-transformer';

export const RESPONSE_TYPE_KEY = 'response-type';

export const ResponseType = (dto: ClassConstructor<unknown>) =>
  SetMetadata(RESPONSE_TYPE_KEY, dto);
