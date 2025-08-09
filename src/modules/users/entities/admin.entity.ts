import { ChildEntity } from 'typeorm';
import { User } from './user.entity';
import { ERole } from '../../../common/enums/role.enum';

@ChildEntity(ERole.ADMIN)
export class Admin extends User {}
