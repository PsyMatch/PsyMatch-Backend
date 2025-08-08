import { Global, Module } from '@nestjs/common';
import { QueryHelper } from './helpers/query.helper';
import { MatchPasswordHelper } from './helpers/matchPassword.helper';

@Global()
@Module({
  providers: [QueryHelper, MatchPasswordHelper],
  exports: [QueryHelper, MatchPasswordHelper],
})
export class UtilsModule {}
