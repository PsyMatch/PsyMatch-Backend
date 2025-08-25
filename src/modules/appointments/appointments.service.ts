import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Raw } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { User } from '../users/entities/user.entity';
import { Psychologist } from '../psychologist/entities/psychologist.entity';
import { AppointmentStatus } from './enums/appointment-status.enum';
import { ERole } from '../../common/enums/role.enum';
import { EInsurance } from '../users/enums/insurances.enum';
import { IAuthRequest } from '../auth/interfaces/auth-request.interface';

function getAuthUserId(req: IAuthRequest): string | undefined {
  return req.user?.id;
}

function isAdmin(req: IAuthRequest): boolean {
  return req.user?.role === ERole.ADMIN;
}

function sanitizeUser(u?: User | null) {
  if (!u) return null;
  return {
    id: u.id,
    name: u.name,
    email: u.email,
  };
}

function sanitizePsychologist(p?: Psychologist | null | { name: string }) {
  if (!p) return null;
  const psychologist = p as Psychologist;
  return {
    id: psychologist.id,
    name: psychologist.name,
    email: psychologist.email,
    personal_biography: psychologist.personal_biography,
    languages: psychologist.languages,
    professional_experience: psychologist.professional_experience,
    professional_title: psychologist.professional_title,
    license_number: psychologist.license_number,
    verified: psychologist.verified,
    office_address: psychologist.office_address,
    specialities: psychologist.specialities,
    therapy_approaches: psychologist.therapy_approaches,
    session_types: psychologist.session_types,
    modality: psychologist.modality,
    insurance_accepted: psychologist.insurance_accepted,
    availability: psychologist.availability,
    consultation_fee: psychologist.consultation_fee,
    profile_picture: psychologist.profile_picture,
  };
}

function combineDateHour(dateISO: string, hourHHmm: string): Date {
  const datePart = dateISO.slice(0, 10);
  const [hh, mm] = hourHHmm.split(':').map(Number);
  const d = new Date(`${datePart}T00:00:00.000Z`);
  d.setUTCHours(hh, mm, 0, 0);
  return d;
}

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Psychologist)
    private readonly psychologistRepository: Repository<Psychologist>,
  ) {}

  async create(req: IAuthRequest, dto: CreateAppointmentDto) {
    const authUserId = getAuthUserId(req);
    if (!authUserId) throw new ForbiddenException('Unauthorized');

    if (dto.user_id !== authUserId && !isAdmin(req)) {
      throw new ForbiddenException(
        'No podés agendar en nombre de otro usuario',
      );
    }

    const patient = await this.userRepository.findOne({
      where: { id: dto.user_id },
    });
    if (!patient)
      throw new NotFoundException(`Patient with ID ${dto.user_id} not found`);

    const psychologist = await this.psychologistRepository.findOne({
      where: { id: dto.psychologist_id },
    });
    if (!psychologist) {
      throw new NotFoundException(
        `Psychologist with ID ${dto.psychologist_id} not found`,
      );
    }

    if (
      (psychologist as Psychologist & { is_verified?: boolean }).is_verified ===
      false
    ) {
      throw new BadRequestException('Psychologist is not verified');
    }

    const when = combineDateHour(dto.date, dto.hour);
    if (when.getTime() <= Date.now()) {
      throw new BadRequestException(
        'La fecha y hora no pueden estar en el pasado',
      );
    }

    const [hh, mm] = dto.hour.split(':').map(Number);

    if (Number.isNaN(hh) || Number.isNaN(mm)) {
      throw new BadRequestException('Formato de hora inválido');
    }

    if (mm !== 0) {
      throw new BadRequestException(
        'Las citas solo pueden agendarse en horas exactas (:00)',
      );
    }

    const validHours = [9, 10, 11, 14, 15, 16];
    if (!validHours.includes(hh)) {
      throw new BadRequestException(
        'Horarios disponibles: 09:00, 10:00, 11:00, 14:00, 15:00, 16:00',
      );
    }

    const conflict = await this.appointmentRepository.findOne({
      where: {
        psychologist: { id: dto.psychologist_id },
        date: Raw((alias) => `${alias} = :when`, { when }),
      },
    });
    if (conflict)
      throw new BadRequestException('Ese horario ya está reservado');

    if (
      dto.session_type &&
      psychologist.session_types?.length &&
      !psychologist.session_types.includes(dto.session_type)
    ) {
      throw new BadRequestException(
        'session_type no disponible para este psicólogo',
      );
    }
    if (
      dto.therapy_approach &&
      psychologist.therapy_approaches?.length &&
      !psychologist.therapy_approaches.includes(dto.therapy_approach)
    ) {
      throw new BadRequestException(
        'therapy_approach no ofrecido por este psicólogo',
      );
    }
    if (
      dto.insurance &&
      psychologist.insurance_accepted?.length &&
      !psychologist.insurance_accepted.includes(dto.insurance as EInsurance)
    ) {
      throw new BadRequestException('insurance no aceptado por este psicólogo');
    }
    if (
      'pricing' in psychologist &&
      psychologist['pricing'] &&
      (dto.price === undefined || dto.price <= 0)
    ) {
      throw new BadRequestException('price debe ser mayor a 0');
    }

    const appointment = this.appointmentRepository.create({
      ...dto,
      date: when,
      patient,
      psychologist,
      status: AppointmentStatus.PENDING,
    });

    const saved = await this.appointmentRepository.save(appointment);

    return {
      id: saved.id,
      date: saved.date,
      duration: 45,
      notes: saved.notes,
      status: saved.status,
      modality: saved.modality,
      hour: saved.hour,
      session_type: saved.session_type,
      therapy_approach: saved.therapy_approach,
      insurance: saved.insurance,
      price: saved.price,
      patient: sanitizeUser(saved.patient),
      psychologist: sanitizePsychologist(saved.psychologist),
    };
  }

  async findAll(req: IAuthRequest) {
    if (isAdmin(req)) {
      const all = await this.appointmentRepository
        .createQueryBuilder('a')
        .leftJoinAndSelect('a.patient', 'patient')
        .leftJoinAndSelect('a.psychologist', 'psychologist')
        .orderBy('a.date', 'ASC')
        .getMany();
      return all.map((a) => ({
        ...a,
        patient: sanitizeUser(a.patient),
        psychologist: sanitizePsychologist(a.psychologist),
      }));
    }
    return this.findMine(req);
  }

  async findMine(req: IAuthRequest) {
    const authUserId = getAuthUserId(req);
    if (!authUserId) throw new ForbiddenException('Unauthorized');

    const mine = await this.appointmentRepository
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.patient', 'patient')
      .leftJoinAndSelect('a.psychologist', 'psychologist')
      .where('patient.id = :uid OR psychologist.id = :uid', { uid: authUserId })
      .orderBy('a.date', 'ASC')
      .getMany();

    return mine.map((a) => ({
      ...a,
      patient: sanitizeUser(a.patient),
      psychologist: sanitizePsychologist(a.psychologist),
    }));
  }

  async findOneAuthorized(req: IAuthRequest, id: string) {
    const a = await this.appointmentRepository.findOne({ where: { id } });
    if (!a) throw new NotFoundException(`Appointment with ID ${id} not found`);

    const authUserId = getAuthUserId(req);
    if (
      !isAdmin(req) &&
      a.patient?.id !== authUserId &&
      a.psychologist?.id !== authUserId
    ) {
      throw new ForbiddenException('No tenés permiso para ver esta cita');
    }

    return {
      ...a,
      patient: sanitizeUser(a.patient),
      psychologist: sanitizePsychologist(a.psychologist),
    };
  }

  async disable(req: IAuthRequest, id: string) {
    const appointment = await this.appointmentRepository.findOne({ where: { id } });
    if (!appointment) throw new NotFoundException(`Appointment with ID ${id} not found`);

    const authUserId = getAuthUserId(req);
    if (!isAdmin(req) && appointment.patient?.id !== authUserId && appointment.psychologist?.id !== authUserId) {
      throw new ForbiddenException(
        'Solo el dueño o admin pueden deshabilitar la cita',
      );
    }

    await this.appointmentRepository
      .createQueryBuilder()
      .update(Appointment)
      .set({ 
        status: AppointmentStatus.CANCELLED,
        isActive: false 
      })
      .where("id = :id", { id })
      .execute();

    return {
      message: `Appointment with ID ${id} disabled successfully`,
      appointment_id: id,
    };
  }

  async confirmAppointment(req: IAuthRequest, id: string) {
    const a = await this.appointmentRepository.findOne({ where: { id } });
    if (!a) throw new NotFoundException(`Appointment with ID ${id} not found`);

    const authUserId = getAuthUserId(req);
    // Solo el psicólogo puede confirmar la cita
    if (!isAdmin(req) && a.psychologist?.id !== authUserId) {
      throw new ForbiddenException(
        'Solo el psicólogo asignado puede confirmar la cita',
      );
    }

    if (a.status !== AppointmentStatus.PENDING) {
      throw new BadRequestException(
        'Solo se pueden confirmar citas con estado PENDING',
      );
    }

    a.status = AppointmentStatus.CONFIRMED;
    await this.appointmentRepository.save(a);

    return {
      message: `Appointment with ID ${id} confirmed successfully`,
      appointment_id: id,
      status: a.status,
    };
  }

  async completeAppointment(req: IAuthRequest, id: string) {
    const a = await this.appointmentRepository.findOne({ where: { id } });
    if (!a) throw new NotFoundException(`Appointment with ID ${id} not found`);

    const authUserId = getAuthUserId(req);
    // Solo el psicólogo puede completar la cita
    if (!isAdmin(req) && a.psychologist?.id !== authUserId) {
      throw new ForbiddenException(
        'Solo el psicólogo asignado puede completar la cita',
      );
    }

    if (a.status !== AppointmentStatus.CONFIRMED) {
      throw new BadRequestException(
        'Solo se pueden completar citas con estado CONFIRMED',
      );
    }

    a.status = AppointmentStatus.COMPLETED;
    await this.appointmentRepository.save(a);

    return {
      message: `Appointment with ID ${id} completed successfully`,
      appointment_id: id,
      status: a.status,
    };
  }


  async getAvailableSlots(
    psychologistId: string,
    dateYYYYMMDD: string,
    slotMinutes = 30,
  ) {
    const psychologist = await this.psychologistRepository.findOne({
      where: { id: psychologistId },
    });
    if (!psychologist) throw new NotFoundException('Psychologist not found');

    const startHour = 9;
    const endHour = 17;
    const dayStart = new Date(`${dateYYYYMMDD}T00:00:00.000Z`);
    const dayEnd = new Date(`${dateYYYYMMDD}T23:59:59.999Z`);

    const taken = await this.appointmentRepository.find({
      where: {
        psychologist: { id: psychologistId },
        date: Raw((alias) => `${alias} BETWEEN :start AND :end`, {
          start: dayStart,
          end: dayEnd,
        }),
      },
    });
    const takenKey = new Set(taken.map((t) => t.date.toISOString()));

    const slots: Array<{ date: string; hour: string; available: boolean }> = [];
    const base = new Date(`${dateYYYYMMDD}T00:00:00.000Z`);
    for (let h = startHour; h <= endHour; h++) {
      for (let m = 0; m < 60; m += slotMinutes) {
        const d = new Date(base);
        d.setUTCHours(h, m, 0, 0);
        const iso = d.toISOString();
        const isPast = d.getTime() <= Date.now();
        const isTaken = takenKey.has(iso);
        if (!isPast) {
          slots.push({
            date: dateYYYYMMDD,
            hour: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`,
            available: !isTaken,
          });
        }
      }
    }
    return slots.filter((s) => s.available);
  }


}
