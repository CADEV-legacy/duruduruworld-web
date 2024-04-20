import { Model, Schema, Types, model, models } from 'mongoose';

import { ACCOUNT_INFORMATION_MODEL_NAME, ACCOUNT_MODEL_NAME, PET_MODEL_NAME } from './name';

import { Gender } from '@/(server)/union';
import {
  nameRegexValidate,
  birthRegexValidate,
  genderUnionValidate,
  emailRegexValidate,
} from '@/(server)/util';

export type AccountInformationSchema = {
  _id: Types.ObjectId;
  name: string;
  email?: string;
  pets: Types.ObjectId[];
  birth: string;
  postalCode: string;
  address: string;
  addressDetail: string;
  gender: Gender;
  marketingAgreement: boolean;
  deliveredCount: number;
  account: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const accountInformationSchema = new Schema<AccountInformationSchema>(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    name: { type: String, required: true, validate: nameRegexValidate },
    email: { type: String, validate: emailRegexValidate },
    pets: { type: [Schema.Types.ObjectId], required: true, ref: PET_MODEL_NAME },
    birth: { type: String, required: true, validate: birthRegexValidate },
    postalCode: { type: String, required: true },
    address: { type: String, required: true },
    addressDetail: { type: String, required: true },
    gender: { type: String, required: true, validate: genderUnionValidate },
    marketingAgreement: { type: Boolean, required: true },
    deliveredCount: { type: Number, default: 0 },
    account: { type: Schema.Types.ObjectId, required: true, ref: ACCOUNT_MODEL_NAME },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export const AccountInformationModel =
  (models[ACCOUNT_INFORMATION_MODEL_NAME] as Model<AccountInformationSchema>) ||
  model<AccountInformationSchema>(ACCOUNT_INFORMATION_MODEL_NAME, accountInformationSchema);
