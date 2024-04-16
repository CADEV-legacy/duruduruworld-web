import { Model, model, models, Schema, Types } from 'mongoose';

import { PET_MODEL_NAME } from '@/(server)/model';
import { Gender } from '@/(server)/union';
import {
  emailRegexValidate,
  phoneNumberRegexValidate,
  identifierRegexValidate,
  passwordRegexValidate,
  nameRegexValidate,
  genderUnionValidate,
} from '@/(server)/util';

export const USER_MODEL_NAME = 'Users' as const;

export type UserSchema = {
  _id: Types.ObjectId;
  identifier: string;
  password?: string;
  email?: string;
  pets: [Types.ObjectId];
  name: string;
  postalCode: string;
  address: string;
  addressDetail: string;
  gender: Gender;
  phoneNumber: string;
  deliverDepth: number;
  createdAt: Date;
  updatedAt: Date;
};

const userSchema = new Schema<UserSchema>(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    identifier: { type: String, required: true, unique: true, validate: identifierRegexValidate },
    password: { type: String, validate: passwordRegexValidate },
    email: {
      type: String,
      unique: true,
      validate: emailRegexValidate,
    },
    pets: { type: [Schema.Types.ObjectId], ref: PET_MODEL_NAME, required: true },
    name: { type: String, required: true, validate: nameRegexValidate },
    postalCode: { type: String, required: true },
    address: { type: String, required: true },
    addressDetail: { type: String, required: true },
    gender: { type: String, required: true, validate: genderUnionValidate },
    phoneNumber: { type: String, required: true, validate: phoneNumberRegexValidate },
    deliverDepth: { type: Number, default: 0 },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export const UserModel =
  (models[USER_MODEL_NAME] as Model<UserSchema>) || model<UserSchema>(USER_MODEL_NAME, userSchema);
