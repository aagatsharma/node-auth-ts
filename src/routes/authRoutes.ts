import express from "express";
import {
  getProfile,
  login,
  register,
  resendVerification,
  verifyUser,
} from "../controller/authController";
import { checkToken } from "../middleware/checkToken";

export default (router: express.Router) => {
  router.post("/auth/register", register);
  router.get("/auth/verify/:token", verifyUser);
  router.get("/auth/login", login);
  router.post("/auth/resendToken", resendVerification);
  router.get("/auth/profile", checkToken, getProfile);
};
