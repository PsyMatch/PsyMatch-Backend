import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export const setupSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('API de PsyMatch')
    .setDescription(
      'Plataforma digital enfocada en salud mental que conecta pacientes con psicólogos según sus necesidades específicas. Resuelve la dificultad actual de encontrar un profesional adecuado ofreciendo recomendaciones personalizadas basadas en síntomas, filtros detallados y agendamiento con pago online. Además, permite a los psicólogos gestionar eficientemente sus consultas y pacientes.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Autorización',
        description:
          'Ingresa el token JWT obtenido desde el endpoint /auth/signin',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
};
