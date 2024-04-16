import { Model, Schema, Types, model, models } from 'mongoose';

export const COMPANY_BUDGET_MODEL_NAME = 'CompanyBudgets' as const;

export type CompanyBudgetSchema = {
  _id: Types.ObjectId;
  count: number;
  admin: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const companyBudgetSchema = new Schema<CompanyBudgetSchema>(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    count: { type: Number, required: true },
    admin: { type: Schema.Types.ObjectId, required: true },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export const CompanyBudgetModel =
  (models[COMPANY_BUDGET_MODEL_NAME] as Model<CompanyBudgetSchema>) ||
  model<CompanyBudgetSchema>(COMPANY_BUDGET_MODEL_NAME, companyBudgetSchema);
