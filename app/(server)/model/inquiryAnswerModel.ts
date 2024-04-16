import { Model, Schema, Types, model, models } from 'mongoose';

export const INQUIRY_ANSWER_MODEL_NAME = 'InquiryAnswers' as const;

export type InquiryAnswerSchema = {
  _id: Types.ObjectId;
  title: string;
  content: string;
  inquiry: Types.ObjectId;
  admin: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const inquiryAnswerSchema = new Schema<InquiryAnswerSchema>(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    inquiry: { type: Schema.Types.ObjectId, required: true },
    admin: { type: Schema.Types.ObjectId, required: true },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export const InquiryAnswerModel =
  (models[INQUIRY_ANSWER_MODEL_NAME] as Model<InquiryAnswerSchema>) ||
  model<InquiryAnswerSchema>(INQUIRY_ANSWER_MODEL_NAME, inquiryAnswerSchema);
