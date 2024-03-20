import { Schema } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
  verified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IVerfication {
  token: String;
  userId: Schema.Types.ObjectId;
  type: String;
  createdAt: Date;
  updatedAt: Date;
}
