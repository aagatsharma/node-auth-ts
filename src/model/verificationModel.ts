import mongoose, { Schema } from "mongoose";
import { IVerfication } from "../types/userTypes";

const verificationSchema = new mongoose.Schema<IVerfication>(
  {
    token: {
      type: String,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

export const Verification = mongoose.model<IVerfication>(
  "Verification",
  verificationSchema
);
