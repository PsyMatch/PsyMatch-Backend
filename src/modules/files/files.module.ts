import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import cloudinary from '../../configs/cloudinary.config';

@Module({
  imports: [],
  controllers: [],
  providers: [FilesService, cloudinary],
  exports: [FilesService],
})
export class FilesModule {}
