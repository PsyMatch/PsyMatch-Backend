import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1756338363204 implements MigrationInterface {
  name = 'Init1756338363204';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TYPE \"public\".\"users_role_enum\" AS ENUM('Paciente', 'Psicólogo', 'Administrador')",
    );
    await queryRunner.query(
      "CREATE TYPE \"public\".\"users_languages_enum\" AS ENUM('Inglés', 'Español', 'Portugués')",
    );
    await queryRunner.query(
      "CREATE TYPE \"public\".\"users_verified_enum\" AS ENUM('Pendiente', 'Validado', 'Rechazado')",
    );
    await queryRunner.query(
      "CREATE TYPE \"public\".\"users_specialities_enum\" AS ENUM('Trastorno de ansiedad', 'Terapia de pareja', 'Trastorno de la alimentación', 'Trastorno bipolar', 'Transiciones de vida', 'Terapia infantil y adolescente', 'Trastornos del sueño', 'Depresión', 'Terapia familiar', 'TDAH', 'TOC', 'Orientación profesional', 'Psicología geriátrica', 'Manejo de la ira', 'Trauma y TEPT', 'Adicción y abuso de sustancias', 'Trastorno del espectro autista', 'Duelo y pérdida', 'LGBTQIA', 'Manejo del dolor crónico')",
    );
    await queryRunner.query(
      "CREATE TYPE \"public\".\"users_therapy_approaches_enum\" AS ENUM('Terapia cognitivo-conductual', 'Terapia de aceptación y compromiso', 'Terapia psicodinámica', 'Terapia de sistemas familiares', 'Terapia breve centrada en soluciones', 'Terapia de juego', 'Terapia dialéctico-conductual', 'Desensibilización y reprocesamiento por movimientos oculares', 'Terapia centrada en la persona', 'Terapia basada en la atención plena', 'Terapia Gestalt', 'Terapia de arte', 'Terapia de grupo')",
    );
    await queryRunner.query(
      "CREATE TYPE \"public\".\"users_session_types_enum\" AS ENUM('Individual', 'Pareja', 'Familiar', 'Grupo')",
    );
    await queryRunner.query(
      "CREATE TYPE \"public\".\"users_modality_enum\" AS ENUM('Presencial', 'En línea', 'Híbrido')",
    );
    await queryRunner.query(
      "CREATE TYPE \"public\".\"users_insurance_accepted_enum\" AS ENUM('OSDE', 'Swiss Medical', 'IOMA', 'PAMI', 'Unión Personal', 'OSDEPYM', 'Luis Pasteur', 'Jerárquicos Salud', 'Sancor Salud', 'OSECAC', 'OSMECON Salud', 'Apross', 'OSPRERA', 'OSPAT', 'ASE Nacional', 'OSPIP', 'Ninguna')",
    );
    await queryRunner.query(
      "CREATE TYPE \"public\".\"users_availability_enum\" AS ENUM('Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo')",
    );
    await queryRunner.query(
      "CREATE TYPE \"public\".\"users_working_hours_enum\" AS ENUM('00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00')",
    );
    await queryRunner.query(
      "CREATE TYPE \"public\".\"users_health_insurance_enum\" AS ENUM('OSDE', 'Swiss Medical', 'IOMA', 'PAMI', 'Unión Personal', 'OSDEPYM', 'Luis Pasteur', 'Jerárquicos Salud', 'Sancor Salud', 'OSECAC', 'OSMECON Salud', 'Apross', 'OSPRERA', 'OSPAT', 'ASE Nacional', 'OSPIP', 'Ninguna')",
    );
    await queryRunner.query(
      'CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "phone" text, "birthdate" date, "dni" bigint, "email" text NOT NULL, "password" text, "profile_picture" text, "role" "public"."users_role_enum" NOT NULL DEFAULT \'Paciente\', "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "last_login" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "provider" text, "provider_id" text, "personal_biography" text, "languages" "public"."users_languages_enum" array, "professional_experience" integer, "professional_title" text, "license_number" bigint, "verified" "public"."users_verified_enum", "office_address" text, "specialities" "public"."users_specialities_enum" array, "therapy_approaches" "public"."users_therapy_approaches_enum" array, "session_types" "public"."users_session_types_enum" array, "modality" "public"."users_modality_enum", "insurance_accepted" "public"."users_insurance_accepted_enum" array, "availability" "public"."users_availability_enum" array, "working_hours" "public"."users_working_hours_enum" array, "consultation_fee" integer, "alias" text, "address" text, "health_insurance" "public"."users_health_insurance_enum", "emergency_contact" text, "reminder_sent" boolean DEFAULT true, CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone"), CONSTRAINT "UQ_5fe9cfa518b76c96518a206b350" UNIQUE ("dni"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_b3c519df62273e4b1dab7f7d6e5" UNIQUE ("license_number"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_ace513fa30d485cfd25c11a9e4" ON "users" ("role") ',
    );
    await queryRunner.query(
      'CREATE TABLE "reviews" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rating" integer NOT NULL, "comment" text NOT NULL, "review_date" date NOT NULL, "userId" uuid NOT NULL, "psychologistId" uuid, CONSTRAINT "PK_231ae565c273ee700b283f15c1d" PRIMARY KEY ("id"))',
    );
    await queryRunner.query(
      "CREATE TYPE \"public\".\"appointments_status_enum\" AS ENUM('pending', 'pending_payment', 'pending_approval', 'confirmed', 'completed', 'cancelled')",
    );
    await queryRunner.query(
      "CREATE TYPE \"public\".\"appointments_modality_enum\" AS ENUM('Presencial', 'En línea', 'Híbrido')",
    );
    await queryRunner.query(
      'CREATE TABLE "appointments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" TIMESTAMP WITH TIME ZONE NOT NULL, "hour" character varying(5) NOT NULL, "duration" integer DEFAULT \'45\', "notes" text, "status" "public"."appointments_status_enum" NOT NULL DEFAULT \'pending_payment\', "modality" "public"."appointments_modality_enum" NOT NULL, "session_type" character varying(50), "therapy_approach" character varying(100), "insurance" character varying(100), "price" numeric(10,2), "isActive" boolean NOT NULL DEFAULT true, "patientId" uuid, "psychologistId" uuid, CONSTRAINT "PK_4a437a9a27e948726b8bb3e36ad" PRIMARY KEY ("id"))',
    );
    await queryRunner.query(
      "CREATE TYPE \"public\".\"payments_pay_method_enum\" AS ENUM('CREDIT_CARD', 'DEBIT_CARD', 'PAYPAL', 'BANK_TRANSFER', 'MERCADO_PAGO')",
    );
    await queryRunner.query(
      "CREATE TYPE \"public\".\"payments_pay_status_enum\" AS ENUM('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED')",
    );
    await queryRunner.query(
      'CREATE TABLE "payments" ("payment_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "appointment_id" uuid, "user_id" uuid, "amount" numeric(10,2) NOT NULL, "currency" character varying(3) NOT NULL DEFAULT \'USD\', "pay_method" "public"."payments_pay_method_enum" NOT NULL, "notes" character varying, "refund_amount" numeric, "mercado_pago_id" character varying, "preference_id" character varying, "payer_email" character varying, "pay_status" "public"."payments_pay_status_enum" NOT NULL DEFAULT \'PENDING\', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8866a3cfff96b8e17c2b204aae0" PRIMARY KEY ("payment_id"))',
    );
    await queryRunner.query(
      'ALTER TABLE "reviews" ADD CONSTRAINT "FK_7ed5659e7139fc8bc039198cc1f" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE "reviews" ADD CONSTRAINT "FK_3d21b4b89510e90f26ac4e6786b" FOREIGN KEY ("psychologistId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE "appointments" ADD CONSTRAINT "FK_13c2e57cb81b44f062ba24df57d" FOREIGN KEY ("patientId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE "appointments" ADD CONSTRAINT "FK_32646a1aa39bc053621eb6aef40" FOREIGN KEY ("psychologistId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "appointments" DROP CONSTRAINT "FK_32646a1aa39bc053621eb6aef40"',
    );
    await queryRunner.query(
      'ALTER TABLE "appointments" DROP CONSTRAINT "FK_13c2e57cb81b44f062ba24df57d"',
    );
    await queryRunner.query(
      'ALTER TABLE "reviews" DROP CONSTRAINT "FK_3d21b4b89510e90f26ac4e6786b"',
    );
    await queryRunner.query(
      'ALTER TABLE "reviews" DROP CONSTRAINT "FK_7ed5659e7139fc8bc039198cc1f"',
    );
    await queryRunner.query('DROP TABLE "payments"');
    await queryRunner.query('DROP TYPE "public"."payments_pay_status_enum"');
    await queryRunner.query('DROP TYPE "public"."payments_pay_method_enum"');
    await queryRunner.query('DROP TABLE "appointments"');
    await queryRunner.query('DROP TYPE "public"."appointments_modality_enum"');
    await queryRunner.query('DROP TYPE "public"."appointments_status_enum"');
    await queryRunner.query('DROP TABLE "reviews"');
    await queryRunner.query(
      'DROP INDEX "public"."IDX_ace513fa30d485cfd25c11a9e4"',
    );
    await queryRunner.query('DROP TABLE "users"');
    await queryRunner.query('DROP TYPE "public"."users_health_insurance_enum"');
    await queryRunner.query('DROP TYPE "public"."users_working_hours_enum"');
    await queryRunner.query('DROP TYPE "public"."users_availability_enum"');
    await queryRunner.query(
      'DROP TYPE "public"."users_insurance_accepted_enum"',
    );
    await queryRunner.query('DROP TYPE "public"."users_modality_enum"');
    await queryRunner.query('DROP TYPE "public"."users_session_types_enum"');
    await queryRunner.query(
      'DROP TYPE "public"."users_therapy_approaches_enum"',
    );
    await queryRunner.query('DROP TYPE "public"."users_specialities_enum"');
    await queryRunner.query('DROP TYPE "public"."users_verified_enum"');
    await queryRunner.query('DROP TYPE "public"."users_languages_enum"');
    await queryRunner.query('DROP TYPE "public"."users_role_enum"');
  }
}
