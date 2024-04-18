import { baseRequest } from '.';

import { UserCountResponse } from '@/(server)/api/user/count/type';
import { UserMeResponse } from '@/(server)/api/user/me/type';

import { API_URL } from '@/constant';

export type UserCountRequestReturn = UserCountResponse;

export const userCountRequest = async () => {
  const response = await baseRequest<UserCountRequestReturn>({
    method: 'get',
    url: API_URL.user.count,
  });

  return response.data;
};

export type UserMeRequestReturn = UserMeResponse;

export const userMeRequest = async () => {
  const response = await baseRequest<UserMeRequestReturn>({
    method: 'get',
    url: API_URL.user.me,
    hasAuth: true,
  });

  return response.data;
};
