import { Model, Schema, Types, model, models } from 'mongoose';

import {
  DELIVERY_ROUND_MODEL_NAME,
  ACCOUNT_MODEL_NAME,
  COMPANY_MODEL_NAME,
  ADMIN_MODEL_NAME,
  PACKAGE_MODEL_NAME,
} from './name';

import { DeliveryCompany, PACKAGE_STATUS, PackageStatus } from '@/(server)/union';
import {
  deliveryCompanyUnionValidate,
  packageStatusUnionValidate,
  trackingNumberRegexValidate,
} from '@/(server)/util';

export type PakcageSchema = {
  _id: Types.ObjectId;
  deliveryRound: Types.ObjectId;
  account: Types.ObjectId;
  company: Types.ObjectId;
  deliveryCompany: DeliveryCompany;
  trackingNumber?: string;
  status: PackageStatus;
  admin: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const packageSchema = new Schema<PakcageSchema>(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    deliveryRound: { type: Schema.Types.ObjectId, required: true, ref: DELIVERY_ROUND_MODEL_NAME },
    account: { type: Schema.Types.ObjectId, required: true, ref: ACCOUNT_MODEL_NAME },
    company: { type: Schema.Types.ObjectId, required: true, ref: COMPANY_MODEL_NAME },
    deliveryCompany: { type: String, required: true, validate: deliveryCompanyUnionValidate },
    trackingNumber: { type: String, default: null, validate: trackingNumberRegexValidate },
    status: {
      type: String,
      default: PACKAGE_STATUS.assigned,
      validate: packageStatusUnionValidate,
    },
    admin: { type: Schema.Types.ObjectId, required: true, ref: ADMIN_MODEL_NAME },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export const PackageModel =
  (models[PACKAGE_MODEL_NAME] as Model<PakcageSchema>) ||
  model<PakcageSchema>(PACKAGE_MODEL_NAME, packageSchema);
