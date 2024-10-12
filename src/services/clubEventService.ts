import "reflect-metadata"
import { inject, injectable } from 'inversify';
import { IClubEventService } from '../types/services/IClubEventService';
import { ClubEventDetailDto } from '../models/dtos/event/club-event-detail-dto';
import { ClubEventInputDto } from '../models/dtos/event/club-event-input-dto';
import { ClubEvent } from '../models/entities/ClubEvent';
import { DataResult } from '../types/result/DataResult';
import { Club } from '../models/entities/Club';
import { CustomError } from '../types/error/CustomError';
import { ClubEventForCreate } from '../models/dtos/event/club-event-for-create';
import { User } from '../models/entities/User';
import { ICloudinaryService } from '../types/services/ICloudinaryService';
import TYPES from '../util/ioc/types';
import { IClubEventRepository } from "../types/repositories/IClubEventRepository";
import { IClubRepository } from "../types/repositories/IClubRepository";
import IUserRepository from "../types/repositories/IUserRepository";

@injectable()
export class ClubEventService implements IClubEventService {
	private readonly clubEventRepository: IClubEventRepository;
	private readonly clubRepository: IClubRepository;
	private readonly userRepository: IUserRepository;
	private readonly cloudinaryService: ICloudinaryService;

	constructor(
		@inject(TYPES.IClubEventRepository) clubEventRepository: IClubEventRepository,
		@inject(TYPES.IClubRepository) clubRepository: IClubRepository,
		@inject(TYPES.IUserRepository) userRepository: IUserRepository,
		@inject(TYPES.ICloudinaryService) cloudinaryService: ICloudinaryService
	) {
		this.clubEventRepository = clubEventRepository;
		this.clubRepository = clubRepository;
		this.userRepository = userRepository;
		this.cloudinaryService = cloudinaryService;
	}
	async create(
		organizerId: string,
		clubEventInput: ClubEventInputDto,
		file: Express.Multer.File
	): Promise<DataResult<ClubEventInputDto>> {
		try {
			const organizer: User = await this.userRepository.getById(organizerId);

			if (!organizer) return { success: false, message: 'Organizer not found!', statusCode: 404, data: null };

			const club: Club = await this.clubRepository.getById(clubEventInput.club);

			if (!club) return { success: false, message: 'Club not found!', statusCode: 404, data: null };

			if (!club.isOrganizer(organizer._id)) {
				return {
					success: false,
					message: 'You are not authorized to create an event for this club!',
					statusCode: 400,
					data: null,
				};
			}

			const eventForCreate: ClubEvent = new ClubEvent({
				title: clubEventInput.title,
				description: clubEventInput.description,
				image: null,
				location: clubEventInput.location,
				date: clubEventInput.date,
				time: clubEventInput.time,
				club: club._id,
				organizer: organizer._id,
				isPublic: clubEventInput.isPublic,
				isUpdated: false,
				isOnline: clubEventInput.isOnline,
				attendeeLimit: clubEventInput?.attendeeLimit ? clubEventInput.attendeeLimit : null,
			});

			if (file) {
				const publicId: string = await this.cloudinaryService.handleUpload(file, 'media');

				eventForCreate.image = publicId;
			}

			await this.clubEventRepository.create(eventForCreate);

			return { success: true, message: 'Event created successfully', statusCode: 201, data: clubEventInput };
		} catch (err) {
			const error: CustomError = new Error(err.message);
			error.statusCode = 500; // Internal Server Error
			throw error;
		}
	}
	async getAll(): Promise<DataResult<Array<ClubEvent>>> {
		try {
			const events = await this.clubEventRepository.getAllPopulated();

			return { success: true, message: 'Events listed successfully!', statusCode: 200, data: events };
		} catch (err) {
			const error: CustomError = new Error(err.message);
			error.statusCode = 500; // Internal Server Error
			throw error;
		}
	}
	async getEventById(id: string): Promise<DataResult<ClubEventDetailDto>> {
		try {
			const event: ClubEvent = await this.clubEventRepository.getById(id);

			if (!event) return { success: false, message: 'Event not found', statusCode: 404, data: null };

			const club: Club = await this.clubRepository.getById(event.getClubId());

			const organizer: User = await this.userRepository.getById(event.getOrganizerId());

			const attendees: User[] = await this.userRepository.getUsersByIds(event.attendees.map(attendee => attendee.toString()));

			const eventDetail: ClubEventDetailDto = {
				title: event.title,
				description: event.description,
				image: event.image,
				location: event.location,
				date: event.date,
				time: event.time,
				club: { _id: club._id, name: club.name },
				organizer: { _id: organizer._id, firstName: organizer.firstName, lastName: organizer.lastName },
				isPublic: event.isPublic,
				isOnline: event.isOnline,
				attendees: attendees.map(attendee => {
					return { _id: attendee._id, firstName: attendee.firstName, lastName: attendee.lastName };
				}),
				attendeeLimit: event.attendeeLimit,
				posts: event.posts,
				isUpdated: event.isUpdated,
			};

			return { success: true, message: 'Event found', statusCode: 200, data: eventDetail };
		} catch (err) {
			const error: CustomError = new Error(err.message);
			error.statusCode = 500; // Internal Server Error
			throw error;
		}
	}
	async getFutureClubEventsByUserId(userId: string): Promise<DataResult<ClubEvent[]>> {
		try {
			const user: User = await this.userRepository.getById(userId);

			if (!user) {
				const error: CustomError = new Error('User not found!');
				error.statusCode = 404;
				throw error;
			}

			const events: ClubEvent[] = await this.clubEventRepository.getFutureEventsByUserId(userId);

			if (!events) return { success: true, message: 'Events not found', statusCode: 404, data: null };

			return { success: true, message: 'Events found', statusCode: 200, data: events };
		} catch (err) {
			const error: CustomError = new Error(err.message);
			error.statusCode = 500; // Internal Server Error
			throw error;
		}
	}

	async getFutureClubEventsByUserIdAndIsPublic(userId: string): Promise<DataResult<ClubEvent[]>> {
		try {
			const user: User = await this.userRepository.getById(userId);

			if (!user) {
				const error: CustomError = new Error('User not found!');
				error.statusCode = 404;
				throw error;
			}

			const events: ClubEvent[] = await this.clubEventRepository.getFutureEventsByUserIdAndIsPublic(userId);

			if (!events) {
				return { success: true, message: 'Events not found', statusCode: 404, data: null };
			}

			return { success: true, message: 'Events fetched successfully', statusCode: 200, data: events };
		} catch (err) {
			const error: CustomError = new Error(err.message);
			error.statusCode = 500; // Internal Server Error
			throw error;
		}
	}
	async update(
		id: string,
		organizerId: string,
		clubEventInput: ClubEventInputDto
	): Promise<DataResult<ClubEventInputDto>> {
		try {
			const organizer: User = await this.userRepository.getById(organizerId);

			if (!organizer) return { success: false, message: 'Organizer not found', statusCode: 404, data: null };

			const event: ClubEvent = await this.clubEventRepository.getById(id);

			if (!event) return { success: false, message: 'Event not found', statusCode: 404, data: null };

			const club: Club = await this.clubRepository.getById(clubEventInput.club);

			if (!club) return { success: false, message: 'Club not found', statusCode: 404, data: null };

			if (!club.isOrganizer(organizer._id))
				return { success: false, message: 'You are not authorized to update this event', statusCode: 400, data: null };

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
				attendeeLimit: clubEventInput?.attendeeLimit ? clubEventInput.attendeeLimit : null,
			};

			await this.clubEventRepository.update(id, eventForUpdate);

			return { success: true, message: 'Event updated successfully', statusCode: 200, data: clubEventInput };
		} catch (err) {
			const error: CustomError = new Error(err.message);
			error.statusCode = 500; // Internal Server Error
			throw error;
		}
	}
	async delete(id: string, organizerId: string): Promise<DataResult<boolean>> {
		try {
			const organizer: User = await this.userRepository.getById(organizerId);

			if (!organizer) return { success: false, message: 'Organizer not found', statusCode: 404, data: false };

			const event: ClubEvent = await this.clubEventRepository.getById(id);

			if (!event) return { success: false, message: 'Event not found', statusCode: 404, data: false };

			const club: Club = await this.clubRepository.getById(event.getClubId());

			if (!club) return { success: false, message: 'Club not found', statusCode: 404, data: false };

			if (!club.isOrganizer(organizer._id))
				return { success: false, message: 'You are not authorized to delete this event', statusCode: 400, data: false };

			const deleted: boolean = await this.clubEventRepository.delete(id);

			return {
				success: deleted,
				message: deleted ? 'Event deleted successfully' : 'Event deletion failed',
				statusCode: 200,
				data: deleted,
			} as DataResult<boolean>;
		} catch (err) {
			const error: CustomError = new Error(err.message);
			error.statusCode = 500; // Internal Server Error
			throw error;
		}
	}
}
