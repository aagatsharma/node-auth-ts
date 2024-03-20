import mongoose from "mongoose";
import validator from "email-validator";
import { IUser } from "../types/userTypes";

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      minlength: 4,
      maxlength: 16,
      required: true,
    },
    email: {
      type: String,
      validate: (email: string) => validator.validate(email),
      required: true,
      unique: true,
      minlength: 6,
      maxlength: 255,
    },
    password: {
      type: String,
      minlength: 8,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
