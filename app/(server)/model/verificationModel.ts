import { Model, Schema, Types, model, models } from 'mongoose';

import { VERIFICATION_MODEL_NAME } from './name';

import { phoneNumberRegexValidate, verificationCodeRegexValidate } from '@/(server)/util';

export type VerificationSchema = {
  _id: Types.ObjectId;
  phoneNumber: string;
  verificationCode: string;
  createdAt: Date;
  updatedAt: Date;
};

export const verificationSchema = new Schema<VerificationSchema>(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    phoneNumber: { type: String, required: true, unique: true, validate: phoneNumberRegexValidate },
    verificationCode: { type: String, required: true, validate: verificationCodeRegexValidate },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export const VerificationModel =
  (models[VERIFICATION_MODEL_NAME] as Model<VerificationSchema>) ||
  model<VerificationSchema>(VERIFICATION_MODEL_NAME, verificationSchema);
