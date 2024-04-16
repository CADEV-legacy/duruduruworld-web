import { Model, model, models, Schema, Types } from 'mongoose';

import { AdminAuthority } from '@/(server)/union';
import {
  adminAuthorityUnionValidate,
  identifierRegexValidate,
  passwordRegexValidate,
} from '@/(server)/util';

export const ADMIN_MODEL_NAME = 'Admins' as const;

export type AdminSchema = {
  _id: Types.ObjectId;
  identifier: string;
  password: string;
  authority: AdminAuthority;
  createdAt: Date;
  updatedAt: Date;
};

const adminSchema = new Schema<AdminSchema>(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    identifier: { type: String, required: true, unique: true, validate: identifierRegexValidate },
    password: { type: String, required: true, validate: passwordRegexValidate },
    authority: { type: String, required: true, validate: adminAuthorityUnionValidate },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export const AdminModel =
  (models[ADMIN_MODEL_NAME] as Model<AdminSchema>) ||
  model<AdminSchema>(ADMIN_MODEL_NAME, adminSchema);
