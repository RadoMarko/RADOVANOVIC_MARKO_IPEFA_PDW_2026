export interface SignInPayload {
  username: string;
  password: string;
  googleHash: string;
  facebookHash: string;
  socialLogin: boolean;
}
