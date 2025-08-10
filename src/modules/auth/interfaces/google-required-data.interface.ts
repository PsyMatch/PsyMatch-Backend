export interface TempOAuthData {
  firstName: string;
  lastName: string;
  email: string;
  picture?: string;
  provider: string;
  providerId: string;
}

export interface CompleteOAuthProfileInput {
  dni: string;
  socialSecurityNumber: string;
  tempOAuthData: TempOAuthData;
}
