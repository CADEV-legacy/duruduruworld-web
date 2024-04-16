import { Model, Schema, Types, model, models } from 'mongoose';

export const KAKAO_MODEL_NAME = 'Kakaos' as const;

export type KakaoSchema = {
  _id: Types.ObjectId;
  productAccountId: string;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
};

// TOOD: Add more datas after implement.
export const kakaoSchema = new Schema<KakaoSchema>(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    productAccountId: { type: String, required: true },
    refreshToken: { type: String },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export const KakaoModel =
  (models[KAKAO_MODEL_NAME] as Model<KakaoSchema>) ||
  model<KakaoSchema>(KAKAO_MODEL_NAME, kakaoSchema);
