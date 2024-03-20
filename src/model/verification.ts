import mongoose, { Schema } from "mongoose";

interface IVerfication {
  token: String;
  userId: Schema.Types.ObjectId;
  type: String;
  createdAt: Date;
  updatedAt: Date;
}

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
