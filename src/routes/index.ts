import express from "express";
import auth from "./authRoutes";

const router = express.Router();

export default (): express.Router => {
  auth(router);

  return router;
};
