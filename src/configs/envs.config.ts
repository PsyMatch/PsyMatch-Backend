import 'dotenv/config';
import { registerAs } from '@nestjs/config';

const server = {
  environment: process.env.ENVIRONMENT ?? 'development',
  port: parseInt(String(process.env.PORT ?? 3000), 10),
  host: process.env.HOST ?? 'localhost',
};

const typeorm = {
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(String(process.env.DB_PORT ?? 5432), 10),
  name: process.env.DB_NAME ?? 'app_db',
  username: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  ssl: process.env.DB_SSL === 'true',
};

const cloudinary = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME ?? 'demo',
  apiKey: process.env.CLOUDINARY_API_KEY ?? '1234567890',
  apiSecret: process.env.CLOUDINARY_API_SECRET ?? 'secret',
};

const jwt = process.env.JWT_SECRET ?? 'default_jwt_secret';

const oauth = {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID ?? 'your_google_client_id',
    clientSecret:
      process.env.GOOGLE_CLIENT_SECRET ?? 'your_google_client_secret',
    callbackUrl:
      process.env.GOOGLE_CALLBACK_URL ??
      'http://your_google_callback/auth/google/callback',
  },
};

const config = { server, typeorm, cloudinary, jwt, oauth };

export const envs = config;

export default registerAs('envs', () => envs);
