import express from "express";
import { register, verifyUser } from "../controller/authController";

export default (router: express.Router) => {
  router.post("/auth/register", register);
  router.get("/auth/verify/:token", verifyUser);
};
