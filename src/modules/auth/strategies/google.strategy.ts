import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth2';
import { VerifiedCallback } from 'passport-jwt';
import { env } from 'process';
import { AuthService } from '../auth.service';
import { Profile } from 'passport';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly authService: AuthService) {
    const clientID = env.GOOGLE_CLIENT_ID;
    const clientSecret = env.GOOGLE_CLIENT_SECRET;
    const callbackURL = env.GOOGLE_CALLBACK_URL;
    if (!clientID) {
      throw new ServiceUnavailableException(
        'Missing required environment variable: GOOGLE_CLIENT_ID',
      );
    }
    if (!clientSecret) {
      throw new ServiceUnavailableException(
        'Missing required environment variable: GOOGLE_CLIENT_SECRET',
      );
    }
    if (!callbackURL) {
      throw new ServiceUnavailableException(
        'Missing required environment variable: GOOGLE_CALLBACK_URL',
      );
    }
    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ['email', 'profile'],
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifiedCallback,
  ) {
    try {
      const oAuthUser = {
        provider: 'google',
        providerId: profile.id,
        email: profile.emails && profile.emails[0] && profile.emails[0].value,
        firstName: profile.name?.givenName || profile.displayName,
        lastName: profile.name?.familyName || '',
        picture: profile.photos && profile.photos[0] && profile.photos[0].value,
        accessToken,
        refreshToken,
        rawProfile: profile,
      };

      const user = await this.authService.validateOAuthLogin(oAuthUser);
      done(null, user);
    } catch (ServiceUnavailableException) {
      done(ServiceUnavailableException, false);
    }
  }
}
