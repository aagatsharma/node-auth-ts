import { NextFunction, Response, Request } from "express";
import { validateAuth } from "../joi/authJoi";
import { errorResponse, validationResponse } from "../helper/responseApi";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password } = req.body;
  const { error } = validateAuth(req.body);
  if (error) {
    validationResponse(error);
  }
  console.log(name);
};
