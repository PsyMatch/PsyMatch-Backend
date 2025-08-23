import { Global, Module } from '@nestjs/common';
import { QueryHelper } from './helpers/query.helper';
import { MatchPasswordHelper } from './helpers/match-password.helper';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from '../../common/interceptors/logging.interceptor';

@Global()
@Module({
  providers: [
    QueryHelper,
    MatchPasswordHelper,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
  exports: [QueryHelper, MatchPasswordHelper],
})
export class UtilsModule {}
