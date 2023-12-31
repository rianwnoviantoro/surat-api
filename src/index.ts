import "reflect-metadata";
import express, { Application, NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";

import "./configs/database";
import { env } from "./configs/env";
import { ErrorHandler } from "./middlewares/error-handler";
import { ResponseHandler } from "./middlewares/response-handler";
import authRouter from "./routes/auth";
import incomingMailRouter from "./routes/incoming-mail";
import userRouter from "./routes/user";
import outgingMailRouter from "./routes/outgoing-mail";
import warrantRouter from "./routes/warrant";
import commonRouter from "./routes/common";

const app: Application = express();

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(ErrorHandler);
app.use(ResponseHandler);

app.use("/auth", authRouter);
app.use("/incoming-mail", incomingMailRouter);
app.use("/outgoing-mail", outgingMailRouter);
app.use("/warrant", warrantRouter);
app.use("/common", commonRouter);
app.use("/user", userRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.error(400, "Not found.");
});

app.listen(env.port, () => {
  console.log(`Serving on port ${env.port}`);
});
