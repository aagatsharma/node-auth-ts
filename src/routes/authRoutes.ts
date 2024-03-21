import express from "express";
import {
  login,
  register,
  resendVerification,
  verifyUser,
} from "../controller/authController";

export default (router: express.Router) => {
  router.post("/auth/register", register);
  router.get("/auth/verify/:token", verifyUser);
  router.get("/auth/login", login);
  router.post("/auth/resendToken", resendVerification);
};
