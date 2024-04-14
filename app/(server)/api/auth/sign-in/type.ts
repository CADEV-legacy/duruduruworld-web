export type AuthSignInRequestBody = {
  email: string;
  password: string;
  autoSignIn: boolean;
};

export type AuthSignInResponse = {
  accessToken: string;
};
