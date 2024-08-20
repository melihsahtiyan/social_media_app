import { ClubEventForCreate } from '../../models/dtos/event/club-event-for-create';
import { ClubEvent } from '../../models/entites/ClubEvent';

export interface IClubEventRepository {
	create(event: ClubEventForCreate): Promise<ClubEvent>;
	getById(id: string): Promise<ClubEvent>;
	getAllPopulated(): Promise<Array<ClubEvent>>;
	getAll(): Promise<Array<ClubEvent>>;
	getFutureEventsByUserId(userId: string): Promise<Array<ClubEvent>>;
	getFutureEventsByUserIdAndIsPublic(userId: string): Promise<Array<ClubEvent>>;
	update(id: string, event: ClubEvent): Promise<ClubEvent>;
	delete(id: string): Promise<boolean>;
}
