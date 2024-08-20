import { IClubEventRepository } from '../types/repositories/IClubEventRepository';
import { ClubEventForUpdate } from '../models/dtos/event/club-event-for-update';
import { ClubEventDoc, clubEvents } from '../models/schemas/club.event.schema';
import { ClubEvent } from '../models/entites/ClubEvent';
import { injectable } from 'inversify';

@injectable()
export class ClubEventRepository implements IClubEventRepository {
	async create(event: ClubEvent): Promise<ClubEvent> {
		return await clubEvents.create(event);
	}
	async getById(id: string): Promise<ClubEvent> {
		return new ClubEvent((await clubEvents.findById(id)).toObject());
	}async getAllPopulated(): Promise<Array<ClubEvent>> {
		return await clubEvents
			.find()
			.populate('club', '_id name')
			.populate('attendees', '_id firstName lastName')
			.populate('posts', '_id content')
			.sort({ createdAt: -1 });
	}
	async getAll(): Promise<Array<ClubEvent>> {
		const events: Array<ClubEventDoc> = await clubEvents.find();
		const result: Array<ClubEvent> = events.map(event => new ClubEvent(event.toObject()));

		return result;
	}
	async getFutureEventsByUserId(userId: string): Promise<Array<ClubEvent>> {
		const events: Array<ClubEvent> = await clubEvents
			.find({
				attendees: { $in: [userId] },
				date: { $gte: new Date() },
			})
			.sort({ date: 1 })
			.sort({ time: 1 });

		return events;
	}
	async getFutureEventsByUserIdAndIsPublic(userId: string): Promise<Array<ClubEvent>> {
		const events: Array<ClubEvent> = await clubEvents.find({
			attendees: userId,
			date: { $gte: Date.now() },
			isPublic: true,
		});

		return events;
	}
	async update(id: string, event: ClubEventForUpdate): Promise<ClubEvent> {
		const updatedEvent: ClubEventDoc = await clubEvents.findByIdAndUpdate(id, event, {
			new: true,
		});

		return new ClubEvent(updatedEvent.toObject());
	}
	async delete(id: string): Promise<boolean> {
		const result = await clubEvents.findByIdAndDelete(id);
		return result ? true : false;
	}
}
