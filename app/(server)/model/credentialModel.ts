import { Model, model, models, Schema, Types } from 'mongoose';

import { ACCOUNT_MODEL_NAME, CREDENTIAL_MODEL_NAME } from './name';

import { identifierRegexValidate } from '@/(server)/util';

export type CredentialSchema = {
  _id: Types.ObjectId;
  identifier: string;
  password: string;
  phoneNumber: string;
  account: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

const credentialSchema = new Schema<CredentialSchema>(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    identifier: { type: String, required: true, unique: true, validate: identifierRegexValidate },
    password: { type: String, required: true },
    account: { type: Schema.Types.ObjectId, required: true, ref: ACCOUNT_MODEL_NAME },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export const CredentialModel =
  (models[CREDENTIAL_MODEL_NAME] as Model<CredentialSchema>) ||
  model<CredentialSchema>(CREDENTIAL_MODEL_NAME, credentialSchema);
