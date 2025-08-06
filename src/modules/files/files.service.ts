import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
  Inject,
} from '@nestjs/common';
import { QueryHelper } from '../utils/helpers/query.helper';
import { User } from '../users/entities/user.entity';
import { CloudinaryInstance } from './interfaces/cloudinary.interface';

@Injectable()
export class FilesService {
  constructor(
    private readonly queryHelper: QueryHelper,
    @Inject('CLOUDINARY') private readonly cloudinary: CloudinaryInstance,
  ) {}

  async upload(id: string, file: Express.Multer.File): Promise<User> {
    return this.queryHelper.runInTransaction(async (queryRunner) => {
      const userRepo = queryRunner.manager.getRepository(User);

      const user = await userRepo.findOne({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      const base64String = Buffer.from(file.buffer).toString('base64');
      const uploadString = `data:${file.mimetype};base64,${base64String}`;

      const result = await this.cloudinary.uploader.upload(uploadString, {
        folder: 'PsyMatch',
        public_id: `user_${id}_${Date.now()}`,
        overwrite: true,
      });

      if (!result) {
        throw new ServiceUnavailableException(
          'Error uploading image to Cloudinary',
        );
      }

      const optimizeUrl: string = this.cloudinary.url(result.public_id, {
        fetch_format: 'auto',
        quality: 'auto',
        crop: 'auto',
        gravity: 'auto',
        width: 300,
        height: 300,
      });

      user.profile_picture = optimizeUrl;
      await userRepo.save(user);

      return user;
    });
  }
}
