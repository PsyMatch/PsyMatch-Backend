import { ChildEntity, ManyToMany, JoinTable } from 'typeorm';
import { ERole } from '../../../common/enums/role.enum';
import { User } from './user.entity';
import { Psychologist } from '../../psychologist/entities/psychologist.entity';

@ChildEntity(ERole.PATIENT)
export class Patient extends User {
  @ManyToMany(() => Psychologist, (psychologist) => psychologist.patients)
  @JoinTable({
    name: 'patient_psychologists',
    joinColumn: { name: 'patient_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'psychologist_id', referencedColumnName: 'id' },
  })
  psychologistss: Psychologist[];
}
