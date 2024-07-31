import { inject, injectable } from 'inversify';
import { ClubRepository } from '../repositories/club-repository';
import { ClubInputDto } from '../models/dtos/club/club-input-dto';
import { Club } from '../models/entites/Club';
import { User } from '../models/entites/User';
import { UserRepository } from '../repositories/user-repository';
import { IClubService } from '../types/services/IClubService';
import { DataResult } from '../types/result/DataResult';
import { Result } from '../types/result/Result';
import { ClubForUpdateDto } from '../models/dtos/club/club-for-update-dto';
import { clearImage } from '../util/fileUtil';
import { CustomError } from '../types/error/CustomError';

@injectable()
export class ClubService implements IClubService {
	protected clubRepository: ClubRepository;
	protected userRepository: UserRepository;

	constructor(
		@inject(ClubRepository) clubRepository: ClubRepository,
		@inject(UserRepository) userRepository: UserRepository
	) {
		this.clubRepository = clubRepository;
		this.userRepository = userRepository;
	}
	public async createClub(club: ClubInputDto, logo?: Express.Multer.File): Promise<DataResult<Club>> {
		try {
			const president: User = await this.userRepository.getById(club.president);

			if (!president) {
				const result: DataResult<Club> = {
					data: null,
					message: 'President not found',
					success: false,
					statusCode: 404
				};
				return result;
			}

			const clubExist = await this.clubRepository.getClubByName(club.name);

			if (clubExist) {
				const result: DataResult<Club> = {
					data: null,
					message: 'Club with this name already exists!',
					success: false,
					statusCode: 400
				};
				return result;
			}

			const clubForCreate: Club = new Club({
				name: club.name,
				biography: club.biography,
				status: club.status,
				president: president._id
			});

			// TODO: refactor this block after implementing file upload
			if (logo) {
				const extension = logo.mimetype.split('/')[1];
				const fileName = logo.filename.split('.')[0];
				const path = `media/profilePhotos/${fileName}-logo.${extension}`;
				clubForCreate.logo = path;
			}

			const createdClub = await this.clubRepository.createClub(clubForCreate);

			const result: DataResult<Club> = {
				data: createdClub,
				message: 'Club created',
				success: true,
				statusCode: 201
			};

			return result;
		} catch (err) {
			const error: CustomError = new Error(err.message);
			error.statusCode = 500; // Internal Server Error
			throw error;
		}
	}
	async getAllClubs(): Promise<DataResult<Club[]>> {
		try {
			const clubs: Array<Club> = await this.clubRepository.getClubs();
			const result: DataResult<Array<Club>> = {
				data: clubs,
				message: 'Clubs found',
				success: true,
				statusCode: 200
			};
			return result;
		} catch (err) {
			const error: CustomError = new Error(err.message);
			error.statusCode = 500; // Internal Server Error
			throw error;
		}
	}
	async getClubById(id: string): Promise<DataResult<Club>> {
		try {
			const club: Club = await this.clubRepository.getClubById(id);
			if (!club) {
				const result: DataResult<Club> = {
					data: null,
					message: 'Club not found',
					success: false,
					statusCode: 404
				};
				return result;
			}

			const result: DataResult<Club> = {
				data: club,
				message: 'Club found',
				success: true,
				statusCode: 200
			};

			return result;
		} catch (err) {
			const error: CustomError = new Error(err.message);
			error.statusCode = 500; // Internal Server Error
			throw error;
		}
	}

	async updateClub(id: string, club: ClubForUpdateDto, organizerId: string): Promise<DataResult<Club>> {
		try {
			const organizer: User = await this.userRepository.getById(organizerId);
			if (!organizer) {
				const result: DataResult<Club> = {
					message: 'Organizer not found',
					success: false,
					statusCode: 404
				};
				return result;
			}

			const clubToUpdate = await this.clubRepository.getClubById(id);
			if (!clubToUpdate) {
				const result: Result = {
					message: 'Club not found!',
					success: false,
					statusCode: 404
				};
				return result;
			}

			if (!clubToUpdate.isOrganizer(organizer._id)) {
				const result: Result = {
					message: 'You are not authorized to update this club!',
					success: false,
					statusCode: 401
				};
				return result;
			}

			const checkNameForUpdate = await this.clubRepository.getClubByName(club.name);

			if (checkNameForUpdate && checkNameForUpdate._id.toString() !== id) {
				const result: DataResult<Club> = {
					message: 'Club with this name already exists!',
					success: false,
					statusCode: 400
				};
				return result;
			}

			const updatedClub = await this.clubRepository.updateClub(id, club);

			const result: DataResult<Club> = {
				message: 'Club updated!',
				data: updatedClub,
				success: true,
				statusCode: 200
			};

			return result;
		} catch (err) {
			const error: CustomError = new Error(err.message);
			error.statusCode = 500; // Internal Server Error
			throw error;
		}
	}
	async updateClubLogo(id: string, logo: Express.Multer.File, organizerId: string): Promise<DataResult<Club>> {
		try {
			const organizer = await this.userRepository.getById(organizerId);

			if (!organizer) {
				const result: DataResult<Club> = {
					message: 'Organizer not found!',
					success: false,
					statusCode: 404
				};
				return result;
			}
			const clubToCheck = await this.clubRepository.getById(id);

			if (!clubToCheck.isOrganizer(organizer._id)) {
				const result: DataResult<Club> = {
					message: 'You are not authorized to update this club!',
					success: false,
					statusCode: 401
				};
				return result;
			}

			if (!clubToCheck) {
				const result: DataResult<Club> = {
					message: 'Club not found!',
					success: false,
					statusCode: 404
				};
				return result;
			}

			const extension = logo.mimetype.split('/')[1];
			const fileName = logo.filename.split('.')[0];
			const path = `media/profilePhotos/${fileName}.${extension}`;

			const updatedClub = await this.clubRepository.updateClubImage(id, path, null);

			const result: DataResult<Club> = {
				message: 'Club logo updated!',
				data: updatedClub,
				success: true,
				statusCode: 200
			};

			return result;
		} catch (err) {
			const error: CustomError = new Error(err.message);
			error.statusCode = 500; // Internal Server Error
			throw error;
		}
	}
	async updateClubBanner(id: string, banner: Express.Multer.File, organizerId: string): Promise<DataResult<Club>> {
		try {
			const organizer = await this.userRepository.getById(organizerId);

			if (!organizer) {
				const result: Result = {
					message: 'Organizer not found!',
					success: false,
					statusCode: 404
				};
				return result;
			}
			const clubToCheck = await this.clubRepository.getById(id);

			if (!clubToCheck.isOrganizer(organizer._id)) {
				const result: Result = {
					message: 'You are not authorized to update this club!',
					success: false,
					statusCode: 401
				};
				return result;
			}

			if (!clubToCheck) {
				const result: Result = {
					message: 'Club not found!',
					success: false,
					statusCode: 404
				};
				return result;
			}

			if (clubToCheck.banner) {
				clearImage(clubToCheck.banner);
			}

			// const extension = banner.mimetype.split('/')[1];
			const path = `media/profilePhotos/${banner.filename}`;

			const updatedClub = await this.clubRepository.updateClubImage(id, null, path);

			const result: DataResult<Club> = {
				message: 'Club banner updated!',
				data: updatedClub,
				success: true,
				statusCode: 200
			};
			return result;
		} catch (err) {
			const error: CustomError = new Error(err.message);
			error.statusCode = 500; // Internal Server Error
			throw error;
		}
	}
	async updateClubPresident(id: string, presidentId: string, updatedPresidentId: string): Promise<DataResult<Club>> {
		try {
			const club = await this.clubRepository.getById(id);
			if (!club) {
				const result: DataResult<Club> = {
					message: 'Club not found!',
					success: false,
					statusCode: 404
				};
				return result;
			}

			const president = await this.userRepository.getById(presidentId);
			if (!president) {
				const result: DataResult<Club> = {
					message: 'President not found!',
					success: false,
					statusCode: 404
				};
				return result;
			}

			if (club.isPresident(president._id)) {
				const result: DataResult<Club> = {
					message: 'You are not authorized to update this club!',
					success: false,
					statusCode: 401
				};
				return result;
			}

			const presitendForUpdate = await this.userRepository.getById(updatedPresidentId);

			if (!presitendForUpdate) {
				const result: DataResult<Club> = {
					message: 'New president not found!',
					success: false,
					statusCode: 404
				};
				return result;
			}

			const updatedClub = await this.clubRepository.updateClubPresident(id, updatedPresidentId);

			const result: DataResult<Club> = {
				message: 'Club president updated!',
				data: updatedClub,
				success: true,
				statusCode: 200
			};
			return result;
		} catch (err) {
			const error: CustomError = new Error(err.message);
			error.statusCode = 500; // Internal Server Error
			throw error;
		}
	}
	async deleteClub(id: string, userId: string): Promise<Result> {
		try {
			const clubExist = await this.clubRepository.getById(id);
			if (!clubExist) {
				const result: Result = {
					message: 'Club not found!',
					success: false,
					statusCode: 404
				};
				return result;
			}

			const president = await this.userRepository.getById(userId);

			if (!president) {
				const result: Result = {
					message: 'President not found!',
					success: false,
					statusCode: 404
				};
				return result;
			}

			if (clubExist.isPresident(president._id)) {
				const result: Result = {
					message: 'You are not authorized to delete this club!',
					success: false,
					statusCode: 401
				};
				return result;
			}

			await this.clubRepository.deleteClub(id);

			const result: Result = {
				message: 'Club deleted!',
				success: true,
				statusCode: 200
			};
			return result;
		} catch (err) {
			const error: CustomError = new Error(err.message);
			error.statusCode = 500; // Internal Server Error
			throw error;
		}
	}
}
