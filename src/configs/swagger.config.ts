import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export const setupSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('PsyMatch API')
    .setDescription(
      'Digital platform focused on mental health that connects patients with psychologists according to their specific needs. It addresses the current difficulty of finding an appropriate professional by offering personalized recommendations based on symptoms, detailed filters, and scheduling with online payment. Additionally, it allows psychologists to efficiently manage their consultations and patients.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description:
          'Enter the JWT token obtained from the /auth/signin endpoint',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
};
