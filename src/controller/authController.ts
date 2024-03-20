import { Response, Request } from "express";
import { validateAuth } from "../joi/authJoi";
import { errorResponse, successResponse } from "../helper/responseApi";
import { User } from "../model/userModel";
import { IUser } from "../types/userTypes";
import bcrypt from "bcryptjs";
import { Verification } from "../model/verificationModel";
import { randomString } from "../helper/randomString";
import { sendEmail } from "../config/nodemailer";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body as IUser;
    // joi validation request body
    const { error } = validateAuth(req.body);

    if (error) {
      return res.status(400).json(errorResponse(error.message, res.statusCode));
    }

    //checks existing email
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res
        .status(400)
        .json(errorResponse("User already exists", res.statusCode));
    }
    //hash password and create user
    const hash = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, hash);
    const createUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    //creates verification token for new user
    const verification = await Verification.create({
      token: randomString(50),
      userId: createUser._id,
    });

    const url = `${process.env.URL}/auth/verify/${verification.token}`;

    sendEmail(createUser.email, url);

    return res
      .status(201)
      .json(
        successResponse(
          "Register success, please activate your account",
          { user: createUser, url },
          201
        )
      );
  } catch (err: any) {
    return res.status(400).json(errorResponse(err.message, res.statusCode));
  }
};

export const verifyUser = async (req: Request, res: Response) => {
  const { token } = req.params;
  try {
    const verification = await Verification.findOne({
      token,
    });

    if (!verification) {
      return res
        .status(404)
        .json(errorResponse("Invalid verification token", res.statusCode));
    }

    await User.findByIdAndUpdate(
      { _id: verification.userId },
      {
        $set: {
          verified: true,
        },
      }
    );
    await Verification.findByIdAndDelete(verification._id);
    return res
      .status(200)
      .json(successResponse("Verified user", null, res.statusCode));
  } catch (err: any) {
    return res.status(400).json(errorResponse(err.message, 400));
  }
};
