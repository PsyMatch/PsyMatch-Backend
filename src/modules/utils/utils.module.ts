import { Global, Module } from '@nestjs/common';
import { QueryTransactionHelper } from './helpers/queryTransaction.helper';
import { MatchPasswordHelper } from './helpers/matchPassword.helper';

@Global()
@Module({
  providers: [QueryTransactionHelper, MatchPasswordHelper],
  exports: [QueryTransactionHelper, MatchPasswordHelper],
})
export class UtilsModule {}
