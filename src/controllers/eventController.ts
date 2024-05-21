import { NextFunction, Response, Express } from "express";
import Request from "../types/Request";
import { inject, injectable } from "inversify";
import { EventService } from "../services/eventService";
import { isValid } from "../util/validationHandler";
import { Result } from "../types/result/Result";
import { EventForUpdate } from "../models/dtos/event/event-for-update";
import { EventListDto } from "../models/dtos/event/event-list-dto";
import { DataResult } from "../types/result/DataResult";
import { EventDetailDto } from "../models/dtos/event/event-detail-dto";
import { EventInputDto } from "../models/dtos/event/event-input-dto";

@injectable()
export class EventController {
  private _eventService: EventService;
  constructor(@inject(EventService) eventService: EventService) {
    this._eventService = eventService;
  }
  async createEvent(req: Request, res: Response, next: NextFunction) {
    try {
      isValid(req, res, next);
      const organizerId: string = req.userId;
      const event: EventInputDto = req.body;
      const image: Express.Multer.File = req.file;
      const result = await this._eventService.createEvent(
        organizerId,
        event,
        image
      );

      return res.status(result.statusCode).json(result);
    } catch (error) {
      next(error);
    }
  }
  async getEventById(req: Request, res: Response, next: NextFunction) {
    try {
      isValid(req, res, next);
      const eventId: string = req.params.id;
      const result: DataResult<EventDetailDto> =
        await this._eventService.getEventById(eventId);

      return res.status(result.statusCode).json(result);
    } catch (error) {
      next(error);
    }
  }
  async getEvents(req: Request, res: Response, next: NextFunction) {
    try {
      isValid(req, res, next);
      const result: DataResult<Array<EventListDto>> =
        await this._eventService.getEvents();

      return res.status(result.statusCode).json(result);
    } catch (error) {
      next(error);
    }
  }
  async updateEvent(req: Request, res: Response, next: NextFunction) {
    try {
      isValid(req, res, next);
      const eventId: string = req.params.id;
      const event: EventForUpdate = req.body;
      const result: Result = await this._eventService.updateEvent(
        eventId,
        event
      );

      return res.status(result.statusCode).json(result);
    } catch (error) {
      next(error);
    }
  }
  async deleteEvent(req: Request, res: Response, next: NextFunction) {
    try {
      isValid(req, res, next);
      const eventId: string = req.params.id;
      const result: Result = await this._eventService.deleteEvent(eventId);

      return res.status(result.statusCode).json(result);
    } catch (error) {
      next(error);
    }
  }
  //   async getEventsByClubId(req: Request, res: Response, next: NextFunction) {
  //     return await this._eventService.getEventsByClubId(clubId);
  //   }
}
