export type AuthFindMyIDRequestSearchParams = {
  phoneNumber: string;
  verificationCode: string;
};

export type AuthFindMyIDResponse = {
  email: string;
};
