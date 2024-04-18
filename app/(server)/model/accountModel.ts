import { Model, Schema, Types, model, models } from 'mongoose';

import {
  CREDENTIAL_MODEL_NAME,
  KAKAO_MODEL_NAME,
  ACCOUNT_INFORMATION_MODEL_NAME,
  ACCOUNT_MODEL_NAME,
} from './name';

import { AccountStatus, AccountType } from '@/(server)/union';
import { accountStatusUnionValidate, accountTypeUnionValidate } from '@/(server)/util';

export type AccountSchema = {
  _id: Types.ObjectId;
  type: AccountType;
  status: AccountStatus;
  credential?: Types.ObjectId;
  kakao?: Types.ObjectId;
  information?: Types.ObjectId;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
};

export const accountSchema = new Schema<AccountSchema>(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    type: { type: String, required: true, validate: accountTypeUnionValidate },
    status: { type: String, required: true, validate: accountStatusUnionValidate },
    credential: { type: Schema.Types.ObjectId, default: null, ref: CREDENTIAL_MODEL_NAME },
    kakao: { type: Schema.Types.ObjectId, default: null, ref: KAKAO_MODEL_NAME },
    information: {
      type: Schema.Types.ObjectId,
      default: null,
      ref: ACCOUNT_INFORMATION_MODEL_NAME,
    },
    refreshToken: { type: String, default: null },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export const AccountModel =
  (models[ACCOUNT_MODEL_NAME] as Model<AccountSchema>) ||
  model<AccountSchema>(ACCOUNT_MODEL_NAME, accountSchema);
