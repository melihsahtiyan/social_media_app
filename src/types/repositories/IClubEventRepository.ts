import { ClubEventForCreate } from '../../models/dtos/event/club-event-for-create';
import { ClubEventForUpdate } from '../../models/dtos/event/club-event-for-update';
import { ClubEvent } from '../../models/entities/ClubEvent';

export interface IClubEventRepository {
	create(event: ClubEventForCreate): Promise<ClubEvent>;
	getById(id: string): Promise<ClubEvent>;
	getAllPopulated(): Promise<Array<ClubEvent>>;
	getAll(): Promise<Array<ClubEvent>>;
	getFutureEventsByUserId(userId: string): Promise<Array<ClubEvent>>;
	getFutureEventsByUserIdAndIsPublic(userId: string): Promise<Array<ClubEvent>>;
	update(id: string, event: ClubEventForUpdate): Promise<ClubEvent>;
	delete(id: string): Promise<boolean>;
}
