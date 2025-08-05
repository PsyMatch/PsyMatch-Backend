import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { RecordsModule } from './modules/records/records.module';

@Module({
  imports: [UsersModule, RecordsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
