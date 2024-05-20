import { inject, injectable } from "inversify";
import { EventForCreate } from "../models/dtos/event/event-for-create";
import { EventForUpdate } from "../models/dtos/event/event-for-update";
import { EventInputDto } from "../models/dtos/event/event-input-dto";
import { EventRepository } from "../repositories/event-repository";
import { IEventService } from "../types/services/IEventService";
import { UserRepository } from "../repositories/user-repository";
import { ClubRepository } from "../repositories/club-repository";
import { DataResult } from "../types/result/DataResult";
import { Result } from "../types/result/Result";
import { EventDetailDto } from "../models/dtos/event/event-detail-dto";
import { EventListDto } from "../models/dtos/event/event-list-dto";

@injectable()
export class EventService implements IEventService {
  private readonly _eventRepository: EventRepository;
  private readonly _userRepository: UserRepository;
  private readonly _clubRepository: ClubRepository;
  constructor(
    @inject(EventRepository) eventRepository: EventRepository,
    @inject(UserRepository) userRepository: UserRepository,
    @inject(ClubRepository) clubRepository: ClubRepository
  ) {
    this._eventRepository = eventRepository;
    this._userRepository = userRepository;
    this._clubRepository = clubRepository;
  }
  async createEvent(
    organizerId: string,
    event: EventInputDto,
    image: Express.Multer.File
  ): Promise<DataResult<EventForCreate>> {
    try {
      const organizer = await this._userRepository.getById(organizerId);
      if (!organizer) {
        const result: DataResult<EventForCreate> = {
          data: null,
          message: "Organizer not found",
          statusCode: 404,
          success: false,
        };
        return result;
      }

      const club = await this._clubRepository.getClubByOrganizerId(organizerId);
      if (!club) {
        const result: DataResult<EventForCreate> = {
          data: null,
          message: "Club not found",
          statusCode: 404,
          success: false,
        };
        return result;
      }

      if (!club.organizers.includes(organizer._id)) {
        const result: DataResult<EventForCreate> = {
          data: null,
          message: "User is not an organizer of the club",
          statusCode: 401,
          success: false,
        };
        return result;
      }
      const imagePath = image ? "media/images/" + image.path : null;

      const newEvent: EventForCreate = {
        title: event.title,
        description: event.description,
        image: imagePath,
        location: event.location,
        date: event.date,
        time: event.time,
        club: club._id,
        isPublic: event.isPublic,
        isOnline: event.isOnline,
      };

      const createdEvent = await this._eventRepository.create(newEvent);

      const result: DataResult<EventForCreate> = {
        data: createdEvent,
        message: "Event created successfully",
        statusCode: 201,
        success: true,
      };

      return result;
    } catch (error) {
      throw error;
    }
  }
  async getEventById(eventId: string): Promise<DataResult<EventDetailDto>> {
    throw new Error("Method not implemented.");
  }
  async getEvents(): Promise<DataResult<Array<EventListDto>>> {
    throw new Error("Method not implemented.");
  }
  async getEventsByClubId(clubId: string): Promise<DataResult<EventListDto[]>> {
    throw new Error("Method not implemented.");
  }
  async updateEvent(eventId: string, event: EventForUpdate): Promise<Result> {
    throw new Error("Method not implemented.");
  }
  async deleteEvent(eventId: string): Promise<Result> {
    throw new Error("Method not implemented.");
  }
}
