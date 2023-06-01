import { Schema, model } from "mongoose";

export interface IPocket {
  name: string;
  amount: number;
  user: Schema.Types.ObjectId;
}

const pocketSchema = new Schema<IPocket>(
  {
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    user: { type: Schema.Types.ObjectId, ref: "Users", required: true },
  },
  { timestamps: true }
);

export default model<IPocket>("Pockets", pocketSchema);
