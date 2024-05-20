import { EventDetailDto } from "../../models/dtos/event/event-detail-dto";
import { EventForCreate } from "../../models/dtos/event/event-for-create";
import { EventForUpdate } from "../../models/dtos/event/event-for-update";
import { EventInputDto } from "../../models/dtos/event/event-input-dto";
import { DataResult } from "../result/DataResult";
import { Result } from "../result/Result";
import { EventListDto } from "../../models/dtos/event/event-list-dto";

export interface IEventService {
  createEvent(
    organizerId: string,
    event: EventInputDto,
    image: Express.Multer.File
  ): Promise<DataResult<EventForCreate>>;
  getEventById(eventId: string): Promise<DataResult<EventDetailDto>>;
  getEvents(): Promise<DataResult<EventListDto[]>>;
  getEventsByClubId(clubId: string): Promise<DataResult<EventListDto[]>>;
  updateEvent(eventId: string, event: EventForUpdate): Promise<Result>;
  deleteEvent(eventId: string): Promise<Result>;
}
