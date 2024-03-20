import express, { Express } from "express";
import dotenv from "dotenv";
import { connectToMongoDB } from "./config/db";
import routes from "./routes";

dotenv.config();

const app: Express = express();

connectToMongoDB();

app.use("/api", routes());

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
