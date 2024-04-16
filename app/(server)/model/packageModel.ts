import { Model, Schema, Types, model, models } from 'mongoose';

import { DeliveryCompany, PACKAGE_STATUS, PackageStatus } from '@/(server)/union';
import {
  deliveryCompanyUnionValidate,
  packageStatusUnionValidate,
  trackingNumberRegexValidate,
} from '@/(server)/util';

export const PACKAGE_MODEL_NAME = 'Packages' as const;

export type PakcageSchema = {
  _id: Types.ObjectId;
  deliveryRound: Types.ObjectId;
  user: Types.ObjectId;
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
    deliveryRound: { type: Schema.Types.ObjectId, required: true },
    user: { type: Schema.Types.ObjectId, required: true },
    company: { type: Schema.Types.ObjectId, required: true },
    deliveryCompany: { type: String, required: true, validate: deliveryCompanyUnionValidate },
    trackingNumber: { type: String, validate: trackingNumberRegexValidate },
    status: {
      type: String,
      default: PACKAGE_STATUS.assigned,
      validate: packageStatusUnionValidate,
    },
    admin: { type: Schema.Types.ObjectId, required: true },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export const PackageModel =
  (models.PACKAGE_MODEL_NAME as Model<PakcageSchema>) ||
  model<PakcageSchema>(PACKAGE_MODEL_NAME, packageSchema);
