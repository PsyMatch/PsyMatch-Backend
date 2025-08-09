import { Injectable } from '@nestjs/common';
import { doesNotMatch } from 'assert';
import { access } from 'fs';
import { env } from 'process';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
   super ({
    clientID: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    callbackURL: env.GOOGLE_CALLBACK_URL,
    scope: ['email', 'profile'],
   });

   async validate(accessToken: string, refreshToken: string, profile: any, done: Function) {
        try {
            const user = await this.authService.validateOAuthLogin('google', profile, accessToken, refreshToken);
}
