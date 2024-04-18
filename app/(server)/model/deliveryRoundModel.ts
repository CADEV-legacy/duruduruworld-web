import { Model, Schema, Types, model, models } from 'mongoose';

import { ADMIN_MODEL_NAME, DELIVERY_ROUND_MODEL_NAME } from './name';

export type DeliveryRoundSchema = {
  _id: Types.ObjectId;
  round: number;
  admin: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const deliveryRoundSchema = new Schema<DeliveryRoundSchema>(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    round: { type: Number, required: true, unique: true },
    admin: { type: Schema.Types.ObjectId, required: true, ref: ADMIN_MODEL_NAME },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export const DeliveryRoundModel =
  (models[DELIVERY_ROUND_MODEL_NAME] as Model<DeliveryRoundSchema>) ||
  model<DeliveryRoundSchema>(DELIVERY_ROUND_MODEL_NAME, deliveryRoundSchema);
