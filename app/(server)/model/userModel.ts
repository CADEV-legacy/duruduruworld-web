import { Model, model, models, Schema, Types } from 'mongoose';

import { Gender } from '@/(server)/union';
import {
  emailRegexValidate,
  phoneNumberRegexValidate,
  ageRegexValidate,
  genderRegexvalidate,
} from '@/(server)/util';

export type UserSchema = {
  _id: Types.ObjectId;
  email: string;
  password: string;
  name: string;
  phoneNumber: string;
  verificationCode?: string;
  age: string;
  gender: Gender;
  postalCode: string;
  address: string;
  addressDetail?: string;
  createdAt: Date;
  updatedAt: Date;
};

const userSchema = new Schema<UserSchema>(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: emailRegexValidate,
    },
    password: { type: String, required: true },
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true, validate: phoneNumberRegexValidate },
    age: { type: String, required: true, validate: ageRegexValidate },
    gender: { type: String, required: true, validate: genderRegexvalidate },
    postalCode: { type: String, required: true },
    address: { type: String, required: true },
    addressDetail: { type: String },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export const UserModel =
  (models.Users as Model<UserSchema>) || model<UserSchema>('Users', userSchema);
