import { Response, Request } from "express";
import {
  validateRegister,
  validateLogin,
  validateResendEmail,
} from "../joi/authJoi";
import { errorResponse, successResponse } from "../helper/responseApi";
import { User } from "../model/userModel";
import { IUser } from "../types/userTypes";
import bcrypt from "bcryptjs";
import { Verification } from "../model/verificationModel";
import { randomString } from "../helper/randomString";
import { sendEmail } from "../config/nodemailer";
import jwt from "jsonwebtoken";

// Register Controller
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body as IUser;
    // joi validation request body
    const { error } = validateRegister(req.body);

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

// Verify User Controller
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
    return res.status(400).json(errorResponse(err.message, res.statusCode));
  }
};

// Login Controller
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as IUser;
    const { error } = validateLogin(req.body);
    if (error) {
      return res.status(400).json(errorResponse(error.message, res.statusCode));
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json(errorResponse("Invalid Credentials", res.statusCode));
    } else {
      const checkPassword = await bcrypt.compare(password, user.password);

      if (!checkPassword) {
        return res
          .status(400)
          .json(errorResponse("Invalid Credentials", res.statusCode));
      }

      if (user && checkPassword && !user.verified) {
        return res
          .status(400)
          .json(errorResponse("Verify your account to login", res.statusCode));
      }

      const payload = {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      };

      const secret = process.env.JWT_SECRET || "Secret key";
      const expiry = process.env.JWT_EXPIRY;
      const token = jwt.sign({ payload }, secret, { expiresIn: expiry });

      return res
        .status(200)
        .json(successResponse("Login Success", { token }, res.statusCode));
    }
  } catch (err: any) {
    return res.status(400).json(errorResponse(err.message, res.statusCode));
  }
};

// Resend Verification Controller
export const resendVerification = async (req: Request, res: Response) => {
  try {
    const { email } = req.body as IUser;
    const { error } = validateResendEmail(req.body);
    if (error) {
      return res.status(400).json(errorResponse(error.message, res.statusCode));
    }
    const user = await User.findOne({ email });

    const verification = await Verification.findOne({
      userId: user?._id,
    });

    if (!user || !verification) {
      return res
        .status(400)
        .json(errorResponse("Invalid Credentials", res.statusCode));
    } else {
      if (user.verified || !verification.token) {
        return res
          .status(400)
          .json(errorResponse("User is already verified", res.statusCode));
      }

      await Verification.findByIdAndDelete(verification._id);

      const newToken = await Verification.create({
        token: randomString(50),
        userId: user._id,
      });

      const url = `${process.env.URL}/auth/verify/${newToken.token}`;

      sendEmail(user.email, url);

      return res
        .status(201)
        .json(
          successResponse(
            "Please activate your account",
            { user: user, url },
            201
          )
        );
    }
  } catch (err: any) {
    return res.status(400).json(errorResponse(err.message, res.statusCode));
  }
};

// Get Profile Controller
export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?.id).select("-password");

    if (!user)
      return res
        .status(404)
        .json(errorResponse("User not found", res.statusCode));

    res
      .status(200)
      .json(successResponse(`Hello ${user.name}`, { user }, res.statusCode));
  } catch (err: any) {
    return res.status(400).json(errorResponse(err.message, res.statusCode));
  }
};
