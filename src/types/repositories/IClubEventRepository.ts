import { ClubEvent } from '../../models/entities/ClubEvent';
import { IRepositoryBase } from './IRepositoryBase';

export interface IClubEventRepository extends IRepositoryBase<ClubEvent> {
	getAllPopulated(): Promise<Array<ClubEvent>>;
	getFutureEventsByUserId(userId: string): Promise<Array<ClubEvent>>;
	getFutureEventsByUserIdAndIsPublic(userId: string): Promise<Array<ClubEvent>>;
}
