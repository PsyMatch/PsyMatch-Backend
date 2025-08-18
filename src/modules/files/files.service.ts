import {
  Injectable,
  ServiceUnavailableException,
  Inject,
} from '@nestjs/common';
import { CloudinaryInstance } from './interfaces/cloudinary.interface';

@Injectable()
export class FilesService {
  constructor(
    @Inject('CLOUDINARY') private readonly cloudinary: CloudinaryInstance,
  ) {}

  async uploadImageToCloudinary(
    file: Express.Multer.File,
    userId: string,
  ): Promise<string> {
    return this.uploadToCloudinary(file, userId, 'profile_pictures');
  }

  async uploadDocumentToCloudinary(
    file: Express.Multer.File,
    userId: string,
    documentType: 'certificate' | 'license' | 'diploma' | 'other' = 'other',
  ): Promise<string> {
    return this.uploadToCloudinary(
      file,
      userId,
      'professional_documents',
      documentType,
    );
  }

  private async uploadToCloudinary(
    file: Express.Multer.File,
    userId: string,
    folder: string = 'profile_pictures',
    documentType?: string,
  ): Promise<string> {
    const base64String = Buffer.from(file.buffer).toString('base64');
    const uploadString = `data:${file.mimetype};base64,${base64String}`;

    const originalName = file.originalname
      ? file.originalname.replace(/\.[^/.]+$/, '')
      : 'file';
    const publicId = documentType
      ? `${documentType}_${originalName}_${userId}`
      : `${originalName}_${userId}`;

    const result = await this.cloudinary.uploader.upload(uploadString, {
      folder: `PsyMatch/${folder}`,
      public_id: publicId,
      overwrite: true,
    });

    if (!result) {
      throw new ServiceUnavailableException(
        'Error uploading file to Cloudinary',
      );
    }

    if (folder === 'professional_documents') {
      return this.cloudinary.url(result.public_id, {
        fetch_format: 'auto',
        quality: '90',
        flags: 'progressive',
      });
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
