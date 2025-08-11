import { ChildEntity } from 'typeorm';
import { ERole } from '../../../common/enums/role.enum';
import { User } from './user.entity';

@ChildEntity(ERole.PATIENT)
export class Patient extends User {}
