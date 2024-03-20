import express from "express";
import { register } from "../controller/registerController";

export default (router: express.Router) => {
  router.post("/auth/register", register);
};
