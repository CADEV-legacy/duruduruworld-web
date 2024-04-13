import { UserSchema, VerificationSchema } from '@/(server)/model';

export type AuthSignUpRequestBody = Omit<UserSchema, '_id' | 'image' | 'createdAt' | 'updatedAt'> &
  Pick<VerificationSchema, 'verificationCode'>;
