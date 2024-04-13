import bcrypt from 'bcryptjs';

import { NotFound } from '@/(error)';

import { SERVER_SETTINGS } from '@/setting';

export const getHashedPassword = (password: string) => {
  if (!SERVER_SETTINGS.CRYPTION_SALT_ROUND)
    throw new NotFound({ type: 'NotFound', code: 404, detail: 'CRYPTION_SECRET' });

  return bcrypt.hash(password, parseInt(SERVER_SETTINGS.CRYPTION_SALT_ROUND));
};

export const comparePassword = (password: string, hashedPassword: string) => {
  return bcrypt.compare(password, hashedPassword);
};
