import { Schema, model } from "mongoose";

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  pockets: string[];
}

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String, required: true },
    pockets: [{ type: Schema.Types.ObjectId, ref: "Pockets" }],
  },
  { timestamps: true }
);

export default model<IUser>("Users", userSchema);
