import { EventListDto } from "../../models/dtos/event/event-list-dto";
import { EventForCreate } from "../../models/dtos/event/event-for-create";
import { EventForUpdate } from "../../models/dtos/event/event-for-update";
import { EventDetailDto } from "../../models/dtos/event/event-detail-dto";

export interface IEventRepository {
  create(event: EventForCreate): Promise<EventForCreate>;
  getEventById(eventId: string): Promise<EventDetailDto>;
  getEvents(): Promise<Array<EventListDto>>;
  getEventsByClubId(clubId: string): Promise<Array<EventListDto>>;
  updateEvent(eventId: string, event: EventForUpdate): Promise<Event>;
  deleteEvent(eventId: string): Promise<boolean>;
}
