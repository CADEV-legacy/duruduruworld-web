import { Model, Schema, Types, model, models } from 'mongoose';

import { ACCOUNT_MODEL_NAME, KAKAO_MODEL_NAME } from './name';

export type KakaoSchema = {
  _id: Types.ObjectId;
  productAccountId: string;
  kakaoRefreshToken?: string;
  account: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

// TOOD: Add more datas after implement.
export const kakaoSchema = new Schema<KakaoSchema>(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    productAccountId: { type: String, required: true },
    kakaoRefreshToken: { type: String, default: null },
    account: { type: Schema.Types.ObjectId, required: true, ref: ACCOUNT_MODEL_NAME },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export const KakaoModel =
  (models[KAKAO_MODEL_NAME] as Model<KakaoSchema>) ||
  model<KakaoSchema>(KAKAO_MODEL_NAME, kakaoSchema);
