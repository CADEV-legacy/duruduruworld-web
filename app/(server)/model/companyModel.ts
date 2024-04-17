import { Model, Schema, Types, model, models } from 'mongoose';

import { ADMIN_MODEL_NAME } from './adminModel';
import { COMPANY_BUDGET_MODEL_NAME } from './companyBudgetModel';

export const COMPANY_MODEL_NAME = 'Companies' as const;

export type CompanySchema = {
  _id: Types.ObjectId;
  name: string;
  image?: string;
  link?: string;
  title?: string;
  content?: string;
  companyBudgets?: Types.ObjectId[];
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
      default: undefined,
      ref: COMPANY_BUDGET_MODEL_NAME,
    },
    admin: { type: Schema.Types.ObjectId, required: true, ref: ADMIN_MODEL_NAME },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export const CompanyModel =
  (models[COMPANY_MODEL_NAME] as Model<CompanySchema>) ||
  model<CompanySchema>(COMPANY_MODEL_NAME, companySchema);
