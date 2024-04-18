import { VerificationSchema } from '@/(server)/model';

export type AuthVerificationCodeSendRequestBody = {
  phoneNumber: string;
};

export type VerificationSchemaSelect = Pick<VerificationSchema, 'verificationCode' | 'updatedAt'>;
