import 'dotenv/config';
import { registerAs } from '@nestjs/config';

const node = process.env.NODE_ENV ?? 'development';

const server = {
  port: parseInt(String(process.env.PORT ?? 3000), 10),
  host: process.env.HOST ?? 'localhost',
};

const typeorm = {
  port: parseInt(String(process.env.DB_PORT ?? 5432), 10),
  host: process.env.DB_HOST ?? 'localhost',
  name: process.env.DB_NAME ?? 'app_db',
  username: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
};

const cloudinary = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME ?? 'demo',
  apiKey: process.env.CLOUDINARY_API_KEY ?? '1234567890',
  apiSecret: process.env.CLOUDINARY_API_SECRET ?? 'secret',
};

const jwt = process.env.JWT_SECRET ?? 'default_jwt_secret';

const zeroAuth2 = {
  googleClientId: process.env.GOOGLE_CLIENT_ID ?? 'your_google_client_id',
  googleClientSecret:
    process.env.GOOGLE_CLIENT_SECRET ?? 'your_google_client_secret',
  googleCallbackUrl:
    process.env.GOOGLE_CALLBACK_URL ??
    'http://localhost:3000/auth/google/callback',
};

const config = { node, server, typeorm, cloudinary, jwt, zeroAuth2 };

export const envs = config;

export default registerAs('envs', () => envs);
