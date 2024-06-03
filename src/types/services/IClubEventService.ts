import { ClubEvent } from "../../models/entites/ClubEvent";
import { ClubEventInputDto } from "../../models/dtos/event/club-event-input-dto";
import { ClubEventDetailDto } from "../../models/dtos/event/club-event-detail-dto";
import { DataResult } from "../result/DataResult";

export interface IClubEventService {
  create(
    organizerId: string,
    clubEventInput: ClubEventInputDto,
    file: Express.Multer.File
  ): Promise<DataResult<ClubEventInputDto>>;
  update(
    id: string,
    organizerId: string,
    clubEventInput: ClubEventInputDto
  ): Promise<DataResult<ClubEventInputDto>>;
  delete(id: string, organizerId: string): Promise<DataResult<boolean>>;
  getEventById(id: string): Promise<DataResult<ClubEventDetailDto>>;
  getAll(): Promise<DataResult<Array<ClubEvent>>>;
}

// TODO
// getClubEvents(): Promise<ClubEvent[]>;
// getClubEventById(id: string): Promise<ClubEvent>;
// updateClubEvent(id: string, clubEventForUpdate: ClubEventForUpdate): Promise<ClubEvent>;
// deleteClubEvent(id: string): Promise<ClubEvent>;
// getClubEventsByClubId(clubId: string): Promise<ClubEvent[]>;
// getClubEventsByUserId(userId: string): Promise<ClubEvent[]>;
// getClubEventsByClubIdAndUserId(clubId: string, userId: string): Promise<ClubEvent[]>;
// getClubEventsByClubIdAndUserIdAndDate(clubId: string, userId: string, date: Date): Promise<ClubEvent[]>;
// getClubEventsByClubIdAndDate(clubId: string, date: Date): Promise<ClubEvent[]>;
// getClubEventsByUserIdAndDate(userId: string, date: Date): Promise<ClubEvent[]>;
// getClubEventsByDate(date: Date): Promise<ClubEvent[]>;
// getClubEventsByDateRange(startDate: Date, endDate: Date): Promise<ClubEvent[]>;
// getClubEventsByClubIdAndDateRange(clubId: string, startDate: Date, endDate: Date): Promise<ClubEvent[]>;
// getClubEventsByUserIdAndDateRange(userId: string, startDate: Date, endDate: Date): Promise<ClubEvent[]>;
// getClubEventsByClubIdAndUserIdAndDateRange(clubId: string, userId: string, startDate: Date, endDate: Date): Promise<ClubEvent[]>;
// getClubEventsByClubIdAndUserIdAndDateRangeAndIsPublic(clubId: string, userId: string, startDate: Date, endDate: Date, isPublic: boolean): Promise<ClubEvent[]>;
// getClubEventsByClubIdAndDateRangeAndIsPublic(clubId: string, startDate: Date, endDate: Date, isPublic: boolean): Promise<ClubEvent[]>;
// getClubEventsByUserIdAndDateRangeAndIsPublic(userId: string, startDate: Date, endDate: Date, isPublic: boolean): Promise<ClubEvent[]>;
// getClubEventsByDateRangeAndIsPublic(startDate: Date, endDate: Date, isPublic: boolean): Promise<ClubEvent[]>;
// getClubEventsByClubIdAndDateRangeAndIsPublicAndIsOnline(clubId: string, startDate: Date, endDate: Date, isPublic: boolean, isOnline: boolean): Promise<ClubEvent[]>;
