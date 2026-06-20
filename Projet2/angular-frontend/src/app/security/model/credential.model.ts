export interface Credential {
  credential_id: string;
  username: string;
  mail: string;
  facebookHash?: string;
  googleHash?: string;
  isAdmin: boolean;
  active: boolean;
  created: string;
  updated: string;
}
