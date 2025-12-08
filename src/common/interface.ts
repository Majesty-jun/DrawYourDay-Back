import { AuthProvider } from './auth-provider.enum';

export interface JwtPayload {
  sub: string;
  email: string;
  provider: AuthProvider;
}

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    username: string;
    provider: AuthProvider;
  };
}
