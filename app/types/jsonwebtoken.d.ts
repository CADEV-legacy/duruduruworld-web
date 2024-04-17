import 'jsonwebtoken';

import { AccountType } from '@/(server)/union';

declare module 'jsonwebtoken' {
  export interface JwtPayload {
    accountId: string;
    accountType: AccountType;
  }
}
