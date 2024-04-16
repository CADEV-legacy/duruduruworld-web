import { Model, Schema, Types, model, models } from 'mongoose';

import { AccountStatus } from '@/(server)/union';
import { accountStatusUnionValidate } from '@/(server)/util';

export const ACCOUNT_MODEL_NAME = 'Accounts' as const;

export type AccountSchema = {
  _id: Types.ObjectId;
  kakao?: Types.ObjectId;
  status: AccountStatus;
  user: Types.ObjectId;
  refreshToken: string;
  createdAt: Date;
  updatedAt: Date;
};

export const accountSchema = new Schema<AccountSchema>(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    kakao: { type: Types.ObjectId, ref: 'Kakaos' },
    status: { type: String, required: true, validate: accountStatusUnionValidate },
    user: { type: Schema.Types.ObjectId, ref: 'Users' },
    refreshToken: { type: String },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export const AccountModel =
  (models[ACCOUNT_MODEL_NAME] as Model<AccountSchema>) ||
  model<AccountSchema>(ACCOUNT_MODEL_NAME, accountSchema);
