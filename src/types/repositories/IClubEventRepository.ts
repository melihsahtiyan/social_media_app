import { ClubEventForUpdate } from "../../models/dtos/event/club-event-for-update";
import { ClubEventForCreate } from "../../models/dtos/event/club-event-for-create";
import { ClubEvent } from "../../models/entites/ClubEvent";
import { ClubEventDetailDto } from "../../models/dtos/event/club-event-detail-dto";
import { ClubEventDoc } from "../../models/schemas/club.event.schema";

export interface IClubEventRepository {
  create(event: ClubEventForCreate): Promise<ClubEvent>;
  update(id: string, event: ClubEventForUpdate): Promise<ClubEventForUpdate>;
  delete(id: string): Promise<boolean>;
  getById(id: string): Promise<ClubEventDoc>;
  getEventById(id: string): Promise<ClubEventDetailDto>;
  getAll(): Promise<Array<ClubEvent>>;
  getFutureEventsByUserId(userId: string): Promise<Array<ClubEvent>>;
  getFutureEventsByUserIdAndIsPublic(userId: string): Promise<Array<ClubEvent>>;
}
