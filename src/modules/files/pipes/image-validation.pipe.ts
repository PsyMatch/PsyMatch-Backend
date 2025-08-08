import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class ImageValidationPipe implements PipeTransform {
  constructor(private readonly isOptional: boolean = false) {}

  transform(file?: Express.Multer.File) {
    if (!file) {
      if (this.isOptional) {
        return undefined;
      }
      throw new BadRequestException('No file uploaded');
    }

    const maxSize = 500 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException(
        `File size should not exceed ${maxSize / 1024}KB`,
      );
    }

    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'image/webp',
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only JPG, JPEG, PNG and WEBP files are allowed',
      );
    }

    return file;
  }
}
