import { inject, injectable } from "inversify";
import { IClubEventService } from "../types/services/IClubEventService";
import { ClubEventDetailDto } from "../models/dtos/event/club-event-detail-dto";
import { ClubEventInputDto } from "../models/dtos/event/club-event-input-dto";
import { ClubEvent } from "../models/entites/ClubEvent";
import { DataResult } from "../types/result/DataResult";
import { ClubEventRepository } from "../repositories/club-event-repository";
import { ClubRepository } from "../repositories/club-repository";
import { UserRepository } from "../repositories/user-repository";
import { UserDoc } from "../models/schemas/user.schema";
import { Club } from "../models/entites/Club";
import { CustomError } from "../types/error/CustomError";
import { handleUpload } from "../util/cloudinaryService";
import { ClubEventForCreate } from "../models/dtos/event/club-event-for-create";
import { ClubEventForUpdate } from "../models/dtos/event/club-event-for-update";

@injectable()
export class ClubEventService implements IClubEventService {
  private readonly clubEventRepository: ClubEventRepository;
  private readonly clubRepository: ClubRepository;
  private readonly userRepository: UserRepository;

  constructor(
    @inject(ClubEventRepository) clubEventRepository: ClubEventRepository,
    @inject(ClubRepository) clubRepository: ClubRepository,
    @inject(UserRepository) userRepository: UserRepository
  ) {
    this.clubEventRepository = clubEventRepository;
    this.clubRepository = clubRepository;
    this.userRepository = userRepository;
  }
  async create(
    organizerId: string,
    clubEventInput: ClubEventInputDto,
    file: Express.Multer.File
  ): Promise<DataResult<ClubEventInputDto>> {
    try {
      const organizer: UserDoc = await this.userRepository.getById(organizerId);

      if (!organizer) {
        const result: DataResult<ClubEventInputDto> = {
          success: false,
          message: "Organizer not found",
          statusCode: 404,
          data: null,
        };
        return result;
      }

      const club: Club = await this.clubRepository.getById(clubEventInput.club);

      if (!club) {
        const result: DataResult<ClubEventInputDto> = {
          success: false,
          message: "Club not found",
          statusCode: 404,
          data: null,
        };
        return result;
      }

      if (!club.organizers.includes(organizer._id)) {
        const result: DataResult<ClubEventInputDto> = {
          success: false,
          message: "You are not authorized to create an event for this club",
          statusCode: 400,
          data: null,
        };
        return result;
      }

      const eventForCreate: ClubEventForCreate = {
        title: clubEventInput.title,
        description: clubEventInput.description,
        image: null,
        location: clubEventInput.location,
        date: clubEventInput.date,
        time: clubEventInput.time,
        club: club._id,
        organizer: organizer._id,
        isPublic: clubEventInput.isPublic,
        isOnline: clubEventInput.isOnline,
      };

      if (file) {
        const extension = file.mimetype.split("/")[1];
        const videoExtensions = ["mp4", "mov", "avi", "mkv", "webm", "m4v"];
        const imageExtensions = ["jpg", "jpeg", "png", "webp", "heic", "gif"];

        let folder: string;
        if (videoExtensions.includes(extension)) {
          folder = "media/videos/";
        } else if (imageExtensions.includes(extension)) {
          folder = "media/images/";
        } else {
          const error: CustomError = new Error("Invalid file type!");
          error.statusCode = 422;
          throw error;
        }

        const fileBuffer = file.buffer.toString("base64");
        let dataURI = "data:" + file.mimetype + ";base64," + fileBuffer;

        console.log("folder: ", folder);

        const publicId: string = await handleUpload(dataURI, folder);

        eventForCreate.image = publicId;
      }

      const createdEvent: ClubEvent = await this.clubEventRepository.create(
        eventForCreate
      );

      const result: DataResult<ClubEventInputDto> = {
        success: true,
        message: "Event created successfully",
        statusCode: 201,
        data: clubEventInput,
      };

      return result;
    } catch (error) {
      throw error;
    }
  }
  async update(
    id: string,
    organizerId: string,
    clubEventInput: ClubEventInputDto
  ): Promise<DataResult<ClubEventInputDto>> {
    try {
      const organizer: UserDoc = await this.userRepository.getById(organizerId);

      if (!organizer) {
        const result: DataResult<ClubEventInputDto> = {
          success: false,
          message: "Organizer not found",
          statusCode: 404,
          data: null,
        };
        return result;
      }

      const event: ClubEvent = await this.clubEventRepository.getById(id);

      if (!event) {
        const result: DataResult<ClubEventInputDto> = {
          success: false,
          message: "Event not found",
          statusCode: 404,
          data: null,
        };
        return result;
      }

      const club: Club = await this.clubRepository.getById(clubEventInput.club);

      if (!club) {
        const result: DataResult<ClubEventInputDto> = {
          success: false,
          message: "Club not found",
          statusCode: 404,
          data: null,
        };
        return result;
      }

      if (!club.organizers.includes(organizer._id)) {
        const result: DataResult<ClubEventInputDto> = {
          success: false,
          message: "You are not authorized to update this event",
          statusCode: 400,
          data: null,
        };
        return result;
      }

      const eventForUpdate: ClubEventForCreate = {
        title: clubEventInput.title,
        description: clubEventInput.description,
        image: event.image,
        location: clubEventInput.location,
        date: clubEventInput.date,
        time: clubEventInput.time,
        club: club._id,
        organizer: event.organizer,
        isPublic: clubEventInput.isPublic,
        isOnline: clubEventInput.isOnline,
      };

      const updatedEvent: ClubEventForUpdate =
        await this.clubEventRepository.update(id, eventForUpdate);

      const result: DataResult<ClubEventInputDto> = {
        success: true,
        message: "Event updated successfully",
        statusCode: 200,
        data: clubEventInput,
      };

      return result;
    } catch (error) {
      throw error;
    }
  }
  async delete(id: string, organizerId: string): Promise<DataResult<boolean>> {
    try {
      const organizer: UserDoc = await this.userRepository.getById(organizerId);

      if (!organizer) {
        const result: DataResult<boolean> = {
          success: false,
          message: "Organizer not found",
          statusCode: 404,
          data: false,
        };
        return result;
      }

      const event: ClubEvent = await this.clubEventRepository.getById(id);

      if (!event) {
        const result: DataResult<boolean> = {
          success: false,
          message: "Event not found",
          statusCode: 404,
          data: false,
        };
        return result;
      }

      const club: Club = await this.clubRepository.getById(
        event.club.toString()
      );

      if (!club) {
        const result: DataResult<boolean> = {
          success: false,
          message: "Club not found",
          statusCode: 404,
          data: false,
        };
        return result;
      }

      if (!club.organizers.includes(organizer._id)) {
        const result: DataResult<boolean> = {
          success: false,
          message: "You are not authorized to delete this event",
          statusCode: 400,
          data: false,
        };
        return result;
      }

      const deleted: boolean = await this.clubEventRepository.delete(id);

      const result: DataResult<boolean> = {
        success: deleted,
        message: deleted
          ? "Event deleted successfully"
          : "Event deletion failed",
        statusCode: 200,
        data: deleted,
      };

      return result;
    } catch (error) {
      throw error;
    }
  }
  async getEventById(id: string): Promise<DataResult<ClubEventDetailDto>> {
    try {
      const event: ClubEventDetailDto =
        await this.clubEventRepository.getEventById(id);

      if (!event) {
        const result: DataResult<ClubEventDetailDto> = {
          success: false,
          message: "Event not found",
          statusCode: 404,
          data: null,
        };
        return result;
      }

      const result: DataResult<ClubEventDetailDto> = {
        success: true,
        message: "Event found",
        statusCode: 200,
        data: event,
      };

      return result;
    } catch (error) {
      throw error;
    }
  }
  async getAll(): Promise<DataResult<Array<ClubEvent>>> {
    try {
      const events = await this.clubEventRepository.getAll();

      const result: DataResult<Array<ClubEvent>> = {
        success: true,
        message: "Events found",
        statusCode: 200,
        data: events,
      };

      return result;
    } catch (error) {
      throw error;
    }
  }
}
