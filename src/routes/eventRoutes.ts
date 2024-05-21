import { Express, NextFunction, Response } from "express";
import { EventController } from "../controllers/eventController";
import container from "../util/ioc/iocContainer";
import Request from "../types/Request";
import isAuth from "../middleware/is-auth";
import { body } from "express-validator";
import { logRequest } from "../util/loggingHandler";

const controller: EventController =
  container.get<EventController>(EventController);

function routes(app: Express) {
  app.post(
    "/event/create",
    logRequest,
    [
      body("title").not().isEmpty().isString().withMessage("Title is required"),
      body("description")
        .not()
        .isEmpty()
        .isString()
        .withMessage("Description is required"),
      body("date").not().isEmpty().isDate().withMessage("Date is required"),
      body("location")
        .not()
        .isEmpty()
        .isString()
        .withMessage("Location is required"),
      body("isPublic")
        .not()
        .isEmpty()
        .isBoolean()
        .withMessage("isPublic is required"),
      body("isOnline")
        .not()
        .isEmpty()
        .isBoolean()
        .withMessage("isOnline is required"),
    ],
    isAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      await controller.createEvent(req, res, next);
    }
  );
}

export default routes;
