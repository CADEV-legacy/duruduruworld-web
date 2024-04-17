export type AuthFindMyIdentifierRequestSearchParams = {
  phoneNumber: string;
  verificationCode: string;
};

export type AuthFindMyIdentifierResponse = {
  identifier: string;
};
