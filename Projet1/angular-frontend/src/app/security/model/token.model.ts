import { Credential } from './credential.model';

export interface Token {
  token_id: string;
  token: string;
  refreshToken: string;
  credential: Credential;
}
