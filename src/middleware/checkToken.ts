import { NextFunction, Request, Response } from "express";
import { errorResponse } from "../helper/responseApi";
import jwt, { Jwt, JwtPayload } from "jsonwebtoken";
import { IUser } from "../types/userTypes";
import { Schema } from "mongoose";

interface ExpressUser extends IUser {
  id: Schema.Types.ObjectId;
}

declare global {
  namespace Express {
    interface Request {
      user?: ExpressUser;
    }
  }
}

export const checkToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorizationHeader = req.header("Authorization");

  if (!authorizationHeader) {
    return res
      .status(400)
      .json(errorResponse("No authorization header set", res.statusCode));
  }

  const splitAuthorizationHeader = authorizationHeader.split(" ");

  const bearer = splitAuthorizationHeader[0];
  const token = splitAuthorizationHeader[1];

  if (bearer !== "Bearer")
    return res
      .status(400)
      .json(errorResponse("The type must be a Bearer", res.statusCode));

  if (!token)
    return res
      .status(404)
      .json(errorResponse("No token found", res.statusCode));
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res
        .status(404)
        .json(
          errorResponse("No secret defined in environment", res.statusCode)
        );
    }
    const jwtData = jwt.verify(token, secret) as Jwt;

    if (!jwtData)
      return res
        .status(401)
        .json(errorResponse("Unauthorized", res.statusCode));

    const jwtpayload = jwtData.payload as JwtPayload;
    req.user = jwtpayload.user;

    next();
  } catch (err) {
    res.status(401).json(errorResponse("Unauthorized", res.statusCode));
  }
};
