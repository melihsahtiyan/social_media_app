import { ClubEventController } from "../controllers/clubEventController";
import container from "../util/ioc/iocContainer";
import { Express, Response, NextFunction } from "express";
import Request from "../types/Request";
import { logRequest } from "../util/loggingHandler";
import isAuth from "../middleware/is-auth";
import { body, param } from "express-validator";
import { eventMediaUpload } from "../util/fileUtil";

const controller: ClubEventController =
  container.get<ClubEventController>(ClubEventController);

function routes(app: Express) {
  app.post(
    "/clubEvent/create",
    logRequest,
    isAuth,
    eventMediaUpload,
    [
      body("title")
        .not()
        .isEmpty()
        .isString()
        .isLength({ min: 3 })
        .withMessage("Invalid title"),
      body("description")
        .not()
        .isEmpty()
        .isString()
        .isLength({ min: 5 })
        .withMessage("Invalid description"),
      body("club").not().isEmpty().isMongoId().withMessage("Invalid club id"),
      body("date").not().isEmpty().isDate().withMessage("Invalid date"),
      body("time").not().isEmpty().isString().withMessage("Invalid time"),
      body("location")
        .not()
        .isEmpty()
        .isString()
        .isLength({ min: 3 })
        .withMessage("Invalid location"),
      body("isPublic")
        .not()
        .isEmpty()
        .isBoolean()
        .withMessage("Invalid isPublic"),
      body("isOnline")
        .not()
        .isEmpty()
        .isBoolean()
        .withMessage("Invalid isOnline"),
    ],
    async (req: Request, res: Response, next: NextFunction) => {
      await controller.create(req, res, next);
    }
  );

  app.put(
    "/clubEvent/update/:id",
    logRequest,
    isAuth,
    [
      param("id").isMongoId().withMessage("Invalid club event id"),
      body("title")
        .not()
        .isEmpty()
        .isString()
        .isLength({ min: 3 })
        .withMessage("Invalid title"),
      body("description")
        .not()
        .isEmpty()
        .isString()
        .isLength({ min: 5 })
        .withMessage("Invalid description"),
      body("club").not().isEmpty().isMongoId().withMessage("Invalid club id"),
      body("date").not().isEmpty().isDate().withMessage("Invalid date"),
      body("time").not().isEmpty().isString().withMessage("Invalid time"),
      body("location")
        .not()
        .isEmpty()
        .isString()
        .isLength({ min: 3 })
        .withMessage("Invalid location"),
      body("isPublic")
        .not()
        .isEmpty()
        .isBoolean()
        .withMessage("Invalid isPublic"),
      body("isOnline")
        .not()
        .isEmpty()
        .isBoolean()
        .withMessage("Invalid isOnline"),
    ],
    async (req: Request, res: Response, next: NextFunction) => {
      await controller.update(req, res, next);
    }
  );

  app.delete(
    "/clubEvent/delete/:id",
    logRequest,
    isAuth,
    [param("id").isMongoId().withMessage("Invalid club event id")],
    async (req: Request, res: Response, next: NextFunction) => {
      await controller.delete(req, res, next);
    }
  );

  app.get(
    "/clubEvent/id=:id",
    logRequest,
    [param("id").isMongoId().withMessage("Invalid club event id")],
    isAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      await controller.getEventById(req, res, next);
    }
  );

  app.get(
    "/clubEvent/getAll",
    logRequest,
    isAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      await controller.getAll(req, res, next);
    }
  );
}

export default routes;
