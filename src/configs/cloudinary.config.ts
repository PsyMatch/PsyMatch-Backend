import { v2 } from 'cloudinary';
import { envs } from './envs.config';

const cloudinary = {
  provide: 'CLOUDINARY',
  useFactory: () => {
    v2.config({
      cloud_name: envs.cloudinary.cloudName,
      api_key: envs.cloudinary.apiKey,
      api_secret: envs.cloudinary.apiSecret,
    });

    return v2;
  },
};

export default cloudinary;
