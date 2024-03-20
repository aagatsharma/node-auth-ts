import express from "express";
import { login, register, verifyUser } from "../controller/authController";

export default (router: express.Router) => {
  router.post("/auth/register", register);
  router.get("/auth/verify/:token", verifyUser);
  router.get("/auth/login", login);
};
