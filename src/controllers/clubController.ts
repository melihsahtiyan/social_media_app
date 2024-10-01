import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { ClubService } from '../services/clubService';
import Request from '../types/Request';
import { NextFunction, Response } from 'express';
import { ClubInputDto } from '../models/dtos/club/club-input-dto';
import { isValid } from '../util/validationHandler';
import { Result } from '../types/result/Result';
import { DataResult } from '../types/result/DataResult';
import { Club } from '../models/entities/Club';
import { ClubForUpdateDto } from '../models/dtos/club/club-for-update-dto';

@injectable()
export class ClubController {
	private clubService: ClubService;
	constructor(@inject(ClubService) clubService: ClubService) {
		this.clubService = clubService;
	}

	async getClubs(req: Request, res: Response, next: NextFunction) {
		try {
			isValid(req);
			const result: DataResult<Array<Club>> = await this.clubService.getAllClubs();

			if (result.success) {
				return res.status(result.statusCode).json({
					message: result.message,
					data: result.data
				});
			}

			return res.status(result.statusCode).json({ result });
		} catch (err) {
			next(err);
		}
	}

	async getClubById(req: Request, res: Response, next: NextFunction) {
		try {
			isValid(req);
			const id: string = req.params.id;
			const result: DataResult<Club> = await this.clubService.getClubById(id);

			if (result.success) {
				return res.status(result.statusCode).json({
					message: result.message,
					data: result.data
				});
			}

			return res.status(result.statusCode).json({ result });
		} catch (err) {
			next(err);
		}
	}
	async createClub(req: Request, res: Response, next: NextFunction) {
		try {
			isValid(req);
			const club: ClubInputDto = req.body;
			club.president = req.userId;
			const logo: Express.Multer.File = req.file;

			const result = await this.clubService.createClub(club, logo);

			if (result.success) {
				return res.status(result.statusCode).json({
					message: result.message,
					data: result.data
				});
			}

			return res.status(result.statusCode).json({ result });
		} catch (err) {
			next(err);
		}
	}
	async updateClub(req: Request, res: Response, next: NextFunction) {
		try {
			isValid(req);
			const id: string = req.params.id;
			const club: ClubForUpdateDto = req.body;
			const organizerId: string = req.userId;
			const result: Result = await this.clubService.updateClub(id, club, organizerId);

			if (result.success) {
				return res.status(result.statusCode).json({ result });
			}

			return res.status(result.statusCode).json({ result });
		} catch (err) {
			next(err);
		}
	}
	async updateClubLogo(req: Request, res: Response, next: NextFunction) {
		try {
			isValid(req);
			const id: string = req.params.id;
			const logo: Express.Multer.File = req.file;
			const organizerId: string = req.userId;

			if (!logo) {
				const result: Result = {
					message: 'Logo is required',
					success: false,
					statusCode: 400
				};
				return res.status(result.statusCode).json({ result });
			}

			const result: Result = await this.clubService.updateClubLogo(id, logo, organizerId);

			if (result.success) {
				return res.status(result.statusCode).json({ result });
			}

			return res.status(result.statusCode).json({ result });
		} catch (err) {
			next(err);
		}
	}
	async updateClubBanner(req: Request, res: Response, next: NextFunction) {
		try {
			isValid(req);
			const id: string = req.params.id;
			const banner: Express.Multer.File = req.file;
			const organizerId: string = req.userId;

			if (!banner) {
				const result: Result = {
					message: 'Banner is required',
					success: false,
					statusCode: 400
				};
				return res.status(result.statusCode).json({ result });
			}

			const result: Result = await this.clubService.updateClubBanner(id, banner, organizerId);

			if (result.success) {
				return res.status(result.statusCode).json({ result });
			}

			return res.status(result.statusCode).json({ result });
		} catch (err) {
			next(err);
		}
	}
	async updateClubPresident(req: Request, res: Response, next: NextFunction) {
		try {
			isValid(req);
			const id: string = req.params.id;
			const presidentId: string = req.userId;
			const updatedPresidentId: string = req.body.presidentId;
			const result: Result = await this.clubService.updateClubPresident(id, presidentId, updatedPresidentId);

			if (result.success) {
				return res.status(result.statusCode).json({ result });
			}

			return res.status(result.statusCode).json({ result });
		} catch (err) {
			next(err);
		}
	}
	async deleteClub(req: Request, res: Response, next: NextFunction) {
		try {
			isValid(req);
			const id: string = req.params.id;
			const userId: string = req.userId;
			const result: Result = await this.clubService.deleteClub(id, userId);

			if (result.success) {
				return res.status(result.statusCode).json({ result });
			}

			return res.status(result.statusCode).json({ result });
		} catch (err) {
			next(err);
		}
	}
}
