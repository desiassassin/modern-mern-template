import dotenv from "dotenv";
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import { mongodb, redis } from "./config/index.js";
import responseMiddleware from "./middlewares/response.js";
import errorHandlerMiddleware from "./middlewares/errorHandler.js";
import notFoundMiddleware from "./middlewares/notFound.js";
import Router from "./routes/index.js";

export const CLIENT = {
     url: `http://localhost:3000`,
     domain: "localhost"
};
const app = express();

// set the client's domain and sub-domain (if exists) so that httpOnly cookies can work
if (process.env.NODE_ENV === "production") {
     CLIENT.url = `https://${process.env.DOMAIN}`;
     CLIENT.domain = process.env.DOMAIN;
}

// MIDDLEWARES
app.set("trust proxy", true);
app.use(
     express.json({
          limit: "5mb"
     })
);
app.use(
     express.urlencoded({
          limit: "5mb",
          parameterLimit: 100000,
          extended: false
     })
);
app.use(
     cors({
          origin: [CLIENT.url],
          credentials: true,
          exposedHeaders: ["ratelimit-reset", "ratelimit-limit", "ratelimit-remaining", "retry-after"]
     })
);
app.use(cookieParser());
app.use(responseMiddleware);
app.use("/", Router);
app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

async function resolveDependencies() {
     await redis.connect();
     await mongodb.connect();

     return Promise.resolve();
}

resolveDependencies().then(() => {
     // LISTENING PORT
     app.listen(3001, () => console.log("Server running on PORT 3001"));
});
