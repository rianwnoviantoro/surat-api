import { Router } from "express";

import IncomingMailController from "@controllers/incoming-mail";
import UseAuth from "@middlewares/auth";
import IncomingMailRepository from "@repositories/incoming-mail";
import UserRepository from "@repositories/user";
import IncomingMailService from "@services/incoming-mail";
import multer from "@utils/multer";

const incomingMailRouter: Router = Router();

const incomingMailRepository = new IncomingMailRepository();
const userRepository = new UserRepository();
const service = new IncomingMailService(incomingMailRepository, userRepository);
const controller = new IncomingMailController(service);

incomingMailRouter.post(
  "/v1",
  UseAuth,
  multer.upload.single("evidence"),
  controller.createMail.bind(controller)
);
incomingMailRouter.get("/v1", UseAuth, controller.mailList.bind(controller));
incomingMailRouter.get("/v2", controller.mailList.bind(controller));

export default incomingMailRouter;
