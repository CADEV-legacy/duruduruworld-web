'use client';

import { useUserMe } from '@/(client)/service';
import { useAuthStore } from '@/(client)/store';

export const Component: React.FC = () => {
  const { accessToken } = useAuthStore();
  const { data } = useUserMe(accessToken);

  return <>{JSON.stringify(data)}</>;
};
