import { Model, Schema, Types, model, models } from 'mongoose';

import { ADMIN_MODEL_NAME } from './adminModel';

export const DELIVERY_ROUND_MODEL_NAME = 'DeliveryRounds' as const;

export type DeliveryRoundSchema = {
  _id: Types.ObjectId;
  round: number;
  deliveryDepth: Types.ObjectId;
  admin: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const deliveryRoundSchema = new Schema<DeliveryRoundSchema>(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    round: { type: Number, required: true, unique: true },
    deliveryDepth: { type: Schema.Types.ObjectId, required: true },
    admin: { type: Schema.Types.ObjectId, required: true, ref: ADMIN_MODEL_NAME },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export const DeliveryRoundModel =
  (models[DELIVERY_ROUND_MODEL_NAME] as Model<DeliveryRoundSchema>) ||
  model<DeliveryRoundSchema>(DELIVERY_ROUND_MODEL_NAME, deliveryRoundSchema);
