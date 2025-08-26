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
      throw new BadRequestException('No se subió ningún archivo');
    }

    const maxSize = maxSizeMB * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException(
        `El tamaño del archivo no debe exceder ${maxSizeMB}MB`,
      );
    }

    const allowedMimeTypes = [
      'image/jpg',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
    ];

    if (allowPDF) {
      allowedMimeTypes.push('application/pdf');
    }

    if (!allowedMimeTypes.includes(file.mimetype)) {
      const fileTypes = allowPDF
        ? 'Se permiten archivos PDF, JPG, JPEG, PNG, GIF y WEBP'
        : 'Se permiten archivos JPG, JPEG, PNG, GIF y WEBP';
      throw new BadRequestException(`Tipo de archivo inválido. ${fileTypes}`);
    }

    return file;
  }
}
