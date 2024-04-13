'use client';

import { useUserMe } from '@/(client)/service';
import { useAuthStore } from '@/(client)/store';

export const Component: React.FC = () => {
  const { auth } = useAuthStore();
  const { data } = useUserMe(auth);

  return <>{JSON.stringify(data)}</>;
};
