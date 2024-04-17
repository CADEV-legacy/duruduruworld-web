import { Model, Schema, Types, model, models } from 'mongoose';

import { ADMIN_MODEL_NAME } from './adminModel';
import { COMPANY_MODEL_NAME } from './companyModel';
import { DELIVERY_ROUND_MODEL_NAME } from './deliveryRoundModel';
import { PACKAGE_MODEL_NAME } from './packageModel';

export const PACKAGE_BUNDLE_MODEL_NAME = 'PackageBundles' as const;

export type PackageBundleSchema = {
  _id: Types.ObjectId;
  deliveryRound: Types.ObjectId;
  company: Types.ObjectId;
  packages: Types.ObjectId[];
  admin: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const packageBundleSchema = new Schema<PackageBundleSchema>(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    deliveryRound: { type: Schema.Types.ObjectId, required: true, ref: DELIVERY_ROUND_MODEL_NAME },
    company: { type: Schema.Types.ObjectId, required: true, ref: COMPANY_MODEL_NAME },
    packages: { type: [Schema.Types.ObjectId], required: true, ref: PACKAGE_MODEL_NAME },
    admin: { type: Schema.Types.ObjectId, required: true, ref: ADMIN_MODEL_NAME },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export const PackageBundleModel =
  (models[PACKAGE_BUNDLE_MODEL_NAME] as Model<PackageBundleSchema>) ||
  model<PackageBundleSchema>(PACKAGE_BUNDLE_MODEL_NAME, packageBundleSchema);
