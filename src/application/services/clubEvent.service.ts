import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { ClubEventDetailDto } from '../../models/dtos/event/club-event-detail-dto';
import { ClubEventInputDto } from '../../models/dtos/event/club-event-input-dto';
import { ClubEvent } from '../../models/entities/ClubEvent';
import { DataResult } from '../../types/result/DataResult';
import { Club } from '../../models/entities/Club';
import { CustomError } from '../../types/error/CustomError';
import { ClubEventForCreate } from '../../models/dtos/event/club-event-for-create';
import { User } from '../../models/entities/User';
import { IClubEventRepository } from '../../persistence/abstracts/IClubEventRepository';
import { ServiceIdentifiers } from '../constants/ServiceIdentifiers';
import RepositoryIdentifiers from '../../persistence/constants/RepsitoryIdentifiers';
import { IClubEventService } from '../abstracts/IClubEventService';
import { IClubService } from '../abstracts/IClubService';
import IUserService from '../abstracts/IUserService';
import { IFileUploadService } from '../abstracts/IFileUploadService';

@injectable()
export class ClubEventService implements IClubEventService {
	private readonly clubEventRepository: IClubEventRepository;
	private readonly clubService: IClubService;
	private readonly userService: IUserService;
	private readonly cloudinaryService: IFileUploadService;

	constructor(
		@inject(RepositoryIdentifiers.IClubEventRepository) clubEventRepository: IClubEventRepository,
		@inject(ServiceIdentifiers.IClubService) clubService: IClubService,
		@inject(ServiceIdentifiers.IUserService) userService: IUserService,
		@inject(ServiceIdentifiers.IFileUploadService) cloudinaryService: IFileUploadService
	) {
		this.clubEventRepository = clubEventRepository;
		this.clubService = clubService;
		this.userService = userService;
		this.cloudinaryService = cloudinaryService;
	}
	async create(
		organizerId: string,
		clubEventInput: ClubEventInputDto,
		file: Express.Multer.File
	): Promise<DataResult<ClubEventInputDto>> {
		try {
			const organizer: User = (await this.userService.getUserById(organizerId)).data;

			if (!organizer) return { success: false, message: 'Organizer not found!', statusCode: 404, data: null };

			const club: Club = (await this.clubService.getClubById(clubEventInput.club)).data;

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

			const club: Club = (await this.clubService.getClubById(event.getClubId())).data;

			const organizer: User = (await this.userService.getUserById(event.getOrganizerId())).data;

			const attendees: User[] = (
				await this.userService.getUsersByIds(event.attendees.map(attendee => attendee.toString()))
			).data;

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
			const user: User = (await this.userService.getUserById(userId)).data;

			if (!user) {
				const error: CustomError = new Error('User not found!');
				error.statusCode = 404;
				throw error;
			}

			const clubs: Club[] = (await this.clubService.getAllClubsByMemberId(userId)).data;

			const events: ClubEvent[] = await this.clubEventRepository.getAll({
				club: { $in: clubs.map(club => club._id) },
				date: { $gte: Date.now() },
			});

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
			const user: User = (await this.userService.getUserById(userId)).data;

			if (!user) {
				const error: CustomError = new Error('User not found!');
				error.statusCode = 404;
				throw error;
			}

			const events: ClubEvent[] = await this.clubEventRepository.getAll({
				isPublic: true,
				date: { $gte: Date.now() },
			});

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
			const organizer: User = (await this.userService.getUserById(organizerId)).data;

			if (!organizer) return { success: false, message: 'Organizer not found', statusCode: 404, data: null };

			const event: ClubEvent = await this.clubEventRepository.getById(id);

			if (!event) return { success: false, message: 'Event not found', statusCode: 404, data: null };

			const club: Club = (await this.clubService.getClubById(clubEventInput.club)).data;

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
			const organizer: User = (await this.userService.getUserById(organizerId)).data;

			if (!organizer) return { success: false, message: 'Organizer not found', statusCode: 404, data: false };

			const event: ClubEvent = await this.clubEventRepository.getById(id);

			if (!event) return { success: false, message: 'Event not found', statusCode: 404, data: false };

			const club: Club = (await this.clubService.getClubById(event.getClubId())).data;

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
