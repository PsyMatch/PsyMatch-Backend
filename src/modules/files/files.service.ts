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

      const optimizeUrl = await this.uploadToCloudinary(file, id);
      user.profile_picture = optimizeUrl;
      await userRepo.save(user);

      return user;
    });
  }

  /**
   * Upload image to Cloudinary and return optimized URL
   * This method can be used by other services without database operations
   */
  async uploadImageToCloudinary(
    file: Express.Multer.File,
    userId: string,
  ): Promise<string> {
    return this.uploadToCloudinary(file, userId);
  }

  /**
   * Private method to handle Cloudinary upload logic
   */
  private async uploadToCloudinary(
    file: Express.Multer.File,
    userId: string,
  ): Promise<string> {
    const base64String = Buffer.from(file.buffer).toString('base64');
    const uploadString = `data:${file.mimetype};base64,${base64String}`;

    const result = await this.cloudinary.uploader.upload(uploadString, {
      folder: 'PsyMatch/users/profile_pictures',
      public_id: `user_${userId}_${Date.now()}`,
      overwrite: true,
    });

    if (!result) {
      throw new ServiceUnavailableException(
        'Error uploading image to Cloudinary',
      );
    }

    return this.cloudinary.url(result.public_id, {
      fetch_format: 'auto',
      quality: 'auto',
      crop: 'auto',
      gravity: 'auto',
      width: 400,
      height: 400,
    });
  }
}
