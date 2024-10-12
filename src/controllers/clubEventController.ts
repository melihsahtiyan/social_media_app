import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { Response, NextFunction } from 'express';
import Request from '../types/Request';
import { DataResult } from '../types/result/DataResult';
import { ClubEventInputDto } from '../models/dtos/event/club-event-input-dto';
import { ClubEventDetailDto } from '../models/dtos/event/club-event-detail-dto';
import { ClubEvent } from '../models/entities/ClubEvent';
import { IClubEventService } from '../types/services/IClubEventService';
import TYPES from '../util/ioc/types';

@injectable()
export class ClubEventController {
	private readonly clubEventService: IClubEventService;

	constructor(@inject(TYPES.IClubEventService) clubEventService: IClubEventService) {
		this.clubEventService = clubEventService;
	}

	async create(req: Request, res: Response, next: NextFunction) {
		try {
			const organizerId: string = req.userId;
			const clubEventInput: ClubEventInputDto = req.body;
			const file: Express.Multer.File = req.file;

			const result: DataResult<ClubEventInputDto> = await this.clubEventService.create(
				organizerId,
				clubEventInput,
				file
			);

			return res.status(result.statusCode).send(result);
		} catch (error) {
			next(error);
		}
	}

	async update(req: Request, res: Response, next: NextFunction) {
		try {
			const organizerId: string = req.userId;
			const clubEventInput: ClubEventInputDto = req.body;
			const id: string = req.params.id;

			const result: DataResult<ClubEventInputDto> = await this.clubEventService.update(id, organizerId, clubEventInput);

			return res.status(result.statusCode).send(result);
		} catch (error) {
			next(error);
		}
	}

	async delete(req: Request, res: Response, next: NextFunction) {
		try {
			const organizerId: string = req.userId;
			const id: string = req.params.id;

			const result: DataResult<boolean> = await this.clubEventService.delete(id, organizerId);

			return res.status(result.statusCode).send(result);
		} catch (error) {
			next(error);
		}
	}

	async getEventById(req: Request, res: Response, next: NextFunction) {
		try {
			const id: string = req.params.id;

			const result: DataResult<ClubEventDetailDto> = await this.clubEventService.getEventById(id);

			return res.status(result.statusCode).send(result);
		} catch (error) {
			next(error);
		}
	}

	async getAll(req: Request, res: Response, next: NextFunction) {
		try {
			const result: DataResult<Array<ClubEvent>> = await this.clubEventService.getAll();

			return res.status(result.statusCode).send(result);
		} catch (error) {
			next(error);
		}
	}

	async getFutureClubEventsByUserIdAndIsPublic(req: Request, res: Response, next: NextFunction) {
		try {
			const userId: string = req.userId;

			const result: DataResult<ClubEvent[]> = await this.clubEventService.getFutureClubEventsByUserIdAndIsPublic(
				userId
			);

			return res.status(200).send(result);
		} catch (error) {
			next(error);
		}
	}
	async getFutureClubEventsByUserId(req: Request, res: Response, next: NextFunction) {
		try {
			const userId: string = req.userId;

			const result: DataResult<ClubEvent[]> = await this.clubEventService.getFutureClubEventsByUserId(userId);

			return res.status(200).send(result);
		} catch (error) {
			next(error);
		}
	}
}
