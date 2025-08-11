import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './configs/envs.config';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './configs/swagger.config';
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor';
import bodyParser from 'body-parser';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
      origin:
        envs.server.environment === 'production'
          ? ['https://your-frontend-domain.com']
          : true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    app.use(bodyParser.json({ limit: '10mb' }));

    const reflector = app.get(Reflector);
    app.useGlobalInterceptors(new TransformResponseInterceptor(reflector));

    setupSwagger(app);

    await app.listen(envs.server.port);

    if (envs.server.environment !== 'production') {
      console.log(
        `🌱 Environment: ${envs.server.environment}, 🚀 App running on http://${envs.server.host}:${envs.server.port}/api`,
      );
    }
  } catch (err) {
    console.error('❌ Error during bootstrap:', err);
    process.exit(1);
  }
}
void bootstrap();
