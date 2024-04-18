import { Model, Schema, Types, model, models } from 'mongoose';

import { ADMIN_MODEL_NAME, FAQ_MODEL_NAME } from './name';

import { FAQType } from '@/(server)/union';
import { faqTypeUnionValidate } from '@/(server)/util';

export type FAQSchema = {
  _id: Types.ObjectId;
  type: FAQType;
  title: string;
  content: string;
  admin: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const faqSchema = new Schema<FAQSchema>(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    type: { type: String, required: true, validate: faqTypeUnionValidate },
    title: { type: String, required: true },
    content: { type: String, required: true },
    admin: { type: Schema.Types.ObjectId, required: true, ref: ADMIN_MODEL_NAME },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export const FAQModel =
  (models[FAQ_MODEL_NAME] as Model<FAQSchema>) || model<FAQSchema>(FAQ_MODEL_NAME, faqSchema);
