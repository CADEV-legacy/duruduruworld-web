import { Model, Schema, Types, model, models } from 'mongoose';

import { PET_MODEL_NAME } from './name';

import { PetType } from '@/(server)/union';
import { birthRegexValidate, nameRegexValidate, petTypeUnionValidate } from '@/(server)/util';

export type PetSchema = {
  _id: Types.ObjectId;
  name: string;
  birth: string;
  type: PetType;
  typeText: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

export const petSchema = new Schema<PetSchema>(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    name: { type: String, required: true, validate: nameRegexValidate },
    birth: { type: String, required: true, validate: birthRegexValidate },
    type: { type: String, required: true, validate: petTypeUnionValidate },
    typeText: { type: String, default: null },
    content: { type: String },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export const PetModel =
  (models[PET_MODEL_NAME] as Model<PetSchema>) || model<PetSchema>(PET_MODEL_NAME, petSchema);
