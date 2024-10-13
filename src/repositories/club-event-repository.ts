import 'reflect-metadata';
import { IClubEventRepository } from '../types/repositories/IClubEventRepository';
import { clubEvents } from '../models/schemas/club.event.schema';
import { ClubEvent } from '../models/entities/ClubEvent';
import { injectable } from 'inversify';
import { RepositoryBase } from './repository-base';

@injectable()
export class ClubEventRepository extends RepositoryBase<ClubEvent> implements IClubEventRepository {
	constructor() {
		super(clubEvents, ClubEvent);
	}
	async getAllPopulated(): Promise<Array<ClubEvent>> {
		return await this.model
			.find()
			.populate('club', '_id name')
			.populate('attendees', '_id firstName lastName')
			.populate('posts', '_id content')
			.sort({ createdAt: -1 });
	}
	async getFutureEventsByUserId(userId: string): Promise<Array<ClubEvent>> {
		const events: Array<ClubEvent> = await this.model
			.find({
				attendees: { $in: [userId] },
				date: { $gte: new Date() },
			})
			.sort({ date: 1 })
			.sort({ time: 1 });

		return events;
	}
	async getFutureEventsByUserIdAndIsPublic(userId: string): Promise<Array<ClubEvent>> {
		const events: Array<ClubEvent> = await this.model.find({
			attendees: userId,
			date: { $gte: Date.now() },
			isPublic: true,
		});

		return events;
	}
}
