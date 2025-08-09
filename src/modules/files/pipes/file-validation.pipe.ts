import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { IFileOptions } from '../interfaces/file-options.interface';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  constructor(private readonly options: IFileOptions = {}) {}

  transform(file?: Express.Multer.File) {
    const {
      maxSizeMB = 2,
      allowPDF = false,
      isOptional = false,
    } = this.options;

    if (!file) {
      if (isOptional) {
        return undefined;
      }
      throw new BadRequestException('No file uploaded');
    }

    const maxSize = maxSizeMB * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException(
        `File size should not exceed ${maxSizeMB}MB`,
      );
    }

    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'image/webp',
    ];

    if (allowPDF) {
      allowedMimeTypes.push('application/pdf');
    }

    if (!allowedMimeTypes.includes(file.mimetype)) {
      const fileTypes = allowPDF
        ? 'PDF, JPG, JPEG, PNG and WEBP files are allowed'
        : 'JPG, JPEG, PNG and WEBP files are allowed';
      throw new BadRequestException(`Invalid file type. Only ${fileTypes}`);
    }

    return file;
  }
}
