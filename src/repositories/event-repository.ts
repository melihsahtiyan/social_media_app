import { injectable } from "inversify";
import { EventDetailDto } from "../models/dtos/event/event-detail-dto";
import { EventForCreate } from "../models/dtos/event/event-for-create";
import { EventForUpdate } from "../models/dtos/event/event-for-update";
import { EventListDto } from "../models/dtos/event/event-list-dto";
import { IEventRepository } from "../types/repositories/IEventRepository";
import { events } from "../models/schemas/event.schema";
import { Event } from "../models/entites/Event";

@injectable()
export class EventRepository implements IEventRepository {
  async getEventsByOrganizerId(organizerId: string): Promise<EventListDto[]> {
    throw new Error("Method not implemented.");
  }
  async getEventsByAttendeeId(attendeeId: string): Promise<EventListDto[]> {
    throw new Error("Method not implemented.");
  }
  async create(event: EventForCreate): Promise<EventForCreate> {
    return await events.create({ ...event });
  }
  async getEventById(eventId: string): Promise<EventDetailDto> {
    return (await events.findById(eventId)) as EventDetailDto;
  }
  async getEvents(): Promise<Array<EventListDto>> {
    return (await events.find()) as Array<EventListDto>;
  }
  async getEventsByClubId(clubId: string): Promise<Array<EventListDto>> {
    return (await events.find({ club: clubId })) as Array<EventListDto>;
  }
  async updateEvent(eventId: string, event: EventForUpdate): Promise<Event> {
    return await events.findByIdAndUpdate(
      eventId,
      { ...event, updatedAt: new Date(Date.now()) },
      { new: true }
    ) as Event;
  }
  async deleteEvent(eventId: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
