import { Model, Schema, Types, model, models } from 'mongoose';

import { InquiryType } from '@/(server)/union';
import { inquiryTypeUnionValidate } from '@/(server)/util';

export const INQUIRY_MODEL_NAME = 'Inquiries' as const;

export type InquirySchema = {
  _id: Types.ObjectId;
  type: InquiryType;
  title: string;
  content: string;
  user: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const inquirySchema = new Schema<InquirySchema>(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    type: { type: String, required: true, validate: inquiryTypeUnionValidate },
    title: { type: String, required: true },
    content: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, required: true },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export const InquiryModel =
  (models[INQUIRY_MODEL_NAME] as Model<InquirySchema>) ||
  model<InquirySchema>(INQUIRY_MODEL_NAME, inquirySchema);
