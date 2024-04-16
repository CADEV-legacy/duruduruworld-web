import { Model, Schema, Types, model, models } from 'mongoose';

import { COMPANY_BUDGET_MODEL_NAME } from '@/(server)/model';

export const COMPANY_MODEL_NAME = 'Companys' as const;

export type CompanySchema = {
  _id: Types.ObjectId;
  name: string;
  image?: string;
  link?: string;
  title?: string;
  content?: string;
  companyBudgets?: [Types.ObjectId];
  admin: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const companySchema = new Schema<CompanySchema>(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    name: { type: String, required: true },
    image: { type: String },
    link: { type: String },
    title: { type: String },
    content: { type: String },
    companyBudgets: {
      type: [Schema.Types.ObjectId],
      ref: COMPANY_BUDGET_MODEL_NAME,
      default: undefined,
    },
    admin: { type: Schema.Types.ObjectId, required: true },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export const CompanyModel =
  (models[COMPANY_MODEL_NAME] as Model<CompanySchema>) ||
  model<CompanySchema>(COMPANY_MODEL_NAME, companySchema);
