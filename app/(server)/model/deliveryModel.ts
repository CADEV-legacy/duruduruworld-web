import { Model, Schema, Types, model, models } from 'mongoose';

import { ADMIN_MODEL_NAME } from './adminModel';
import { DELIVERY_ROUND_MODEL_NAME } from './deliveryRoundModel';
import { PACKAGE_BUNDLE_MODEL_NAME } from './packageBundleModel';

export const DELIVERY_MODEL_NAME = 'Deliveries' as const;

export type DeliverySchema = {
  _id: Types.ObjectId;
  deliveryRound: Types.ObjectId;
  packageBundles: Types.ObjectId[];
  admin: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const deliverySchema = new Schema<DeliverySchema>(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    deliveryRound: { type: Schema.Types.ObjectId, required: true, ref: DELIVERY_ROUND_MODEL_NAME },
    packageBundles: {
      type: [Schema.Types.ObjectId],
      required: true,
      ref: PACKAGE_BUNDLE_MODEL_NAME,
    },
    admin: { type: Schema.Types.ObjectId, required: true, ref: ADMIN_MODEL_NAME },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export const DeliveryModel =
  (models[DELIVERY_MODEL_NAME] as Model<DeliverySchema>) ||
  model<DeliverySchema>(DELIVERY_MODEL_NAME, deliverySchema);
