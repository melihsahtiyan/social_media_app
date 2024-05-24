import { Express, NextFunction, Response } from "express";
import { EventController } from "../controllers/eventController";
import container from "../util/ioc/iocContainer";
import Request from "../types/Request";
import isAuth from "../middleware/is-auth";
import { body, param } from "express-validator";
import { logRequest } from "../util/loggingHandler";

const controller: EventController =
  container.get<EventController>(EventController);

function routes(app: Express) {
  app.post(
    "/event/create",
    logRequest,
    isAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      await controller.createEvent(req, res, next);
    }
  );

  app.get(
    "/event/id=:id",
    logRequest,
    isAuth,
    [param("id").isMongoId().withMessage("Invalid event id!")],
    async (req: Request, res: Response, next: NextFunction) => {
      await controller.getEventById(req, res, next);
    }
  );

  app.get(
    "/event/getAll",
    logRequest,
    isAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      await controller.getEvents(req, res, next);
    }
  );

  app.get(
    "/event/getAllByClubId/id=:id",
    logRequest,
    isAuth,
    [param("id").isMongoId().withMessage("Invalid event id!")],
    async (req: Request, res: Response, next: NextFunction) => {
      await controller.getEventsByClubId(req, res, next);
    }
  );
}

export default routes;
