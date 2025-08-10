import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './configs/envs.config';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './configs/swagger.config';
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    const reflector = app.get(Reflector);
    app.useGlobalInterceptors(new TransformResponseInterceptor(reflector));

    setupSwagger(app);

    await app.listen(envs.server.port);

    if (envs.server.node !== 'production') {
      console.log(
        `🌱 Environment: ${envs.server.node}, 🚀 App running on http://${envs.server.host}:${envs.server.port}/api`,
      );
    }
  } catch (err) {
    console.error('❌ Error during bootstrap:', err);
    process.exit(1);
  }
}
void bootstrap();
