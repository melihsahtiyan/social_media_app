import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { ClubInputDto } from '../../models/dtos/club/club-input-dto';
import { Club } from '../../models/entities/Club';
import { User } from '../../models/entities/User';
import { DataResult } from '../../types/result/DataResult';
import { Result } from '../../types/result/Result';
import { ClubForUpdateDto } from '../../models/dtos/club/club-for-update-dto';
import { clearImage } from '../../util/fileUtil';
import { CustomError } from '../../types/error/CustomError';
import { IClubRepository } from '../../persistence/abstracts/IClubRepository';
import IUserRepository from '../../persistence/abstracts/IUserRepository';
import RepositoryIdentifiers from '../../persistence/constants/RepsitoryIdentifiers';
import { IClubService } from '../abstracts/IClubService';

@injectable()
export class ClubService implements IClubService {
	protected clubRepository: IClubRepository;
	protected userRepository: IUserRepository;

	constructor(
		@inject(RepositoryIdentifiers.IClubRepository) clubRepository: IClubRepository,
		@inject(RepositoryIdentifiers.IUserRepository) userRepository: IUserRepository
	) {
		this.clubRepository = clubRepository;
		this.userRepository = userRepository;
	}
	public async createClub(club: ClubInputDto, logo?: Express.Multer.File): Promise<DataResult<ClubInputDto>> {
		try {
			const president: User = await this.userRepository.getById(club.president);

			if (!president) {
				const result: DataResult<ClubInputDto> = {
					data: null,
					message: 'President not found',
					success: false,
					statusCode: 404,
				};
				return result;
			}

			const clubExist = await this.clubRepository.getClubByName(club.name);

			if (clubExist) {
				const result: DataResult<ClubInputDto> = {
					data: null,
					message: 'Club with this name already exists!',
					success: false,
					statusCode: 400,
				};
				return result;
			}

			const clubForCreate: Club = new Club({
				name: club.name,
				biography: club.biography,
				status: club.status,
				president: president._id,
				banner: null,
				logo: null,
				createdAt: new Date(Date.now()),
				events: [],
				members: [],
				organizers: [president._id],
				posts: [],
			});

			// TODO: refactor this block after implementing file upload
			if (logo) {
				const extension = logo.mimetype.split('/')[1];
				const fileName = logo.filename.split('.')[0];
				const path = `media/profilePhotos/${fileName}-logo.${extension}`;
				clubForCreate.logo = path;
			}

			const createdClub: Club = await this.clubRepository.createClub(clubForCreate);

			const responseClub: ClubInputDto = {
				name: createdClub.name,
				biography: createdClub.biography,
				status: createdClub.status,
				president: createdClub.getPresidentId(),
			};

			const result: DataResult<ClubInputDto> = {
				data: responseClub,
				message: 'Club created',
				success: true,
				statusCode: 201,
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
				statusCode: 200,
			};
			return result;
		} catch (err) {
			const error: CustomError = new Error(err.message);
			error.statusCode = 500; // Internal Server Error
			throw error;
		}
	}
	async getAllClubsByMemberId(userId: string): Promise<DataResult<Array<Club>>> {
		try {
			const clubs: Array<Club> = await this.clubRepository.getAll({ $where: `this.members.includes("${userId}")` });

			return {
				data: clubs,
				message: 'Clubs found',
				success: true,
				statusCode: 200,
			} as DataResult<Array<Club>>;
		} catch (err) {
			const error: CustomError = new CustomError(
				err.message,
				err.statusCode,
				null,
				'ClubService',
				'getAllClubsByMemberId'
			);
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
					statusCode: 404,
				};
				return result;
			}

			const result: DataResult<Club> = {
				data: club,
				message: 'Club found',
				success: true,
				statusCode: 200,
			};

			return result;
		} catch (err) {
			const error: CustomError = new Error(err.message);
			error.statusCode = 500; // Internal Server Error
			throw error;
		}
	}

	async updateClub(id: string, club: ClubForUpdateDto, organizerId: string): Promise<Result> {
		try {
			const organizer: User = await this.userRepository.getById(organizerId);
			if (!organizer)
				return {
					message: 'Organizer not found',
					success: false,
					statusCode: 404,
				};

			const clubToUpdate = await this.clubRepository.getClubById(id);
			if (!clubToUpdate)
				return {
					message: 'Club not found!',
					success: false,
					statusCode: 404,
				};

			if (!clubToUpdate.isOrganizer(organizer._id))
				return {
					message: 'You are not authorized to update this club!',
					success: false,
					statusCode: 401,
				};

			const checkNameForUpdate = await this.clubRepository.getClubByName(club.name);

			if (checkNameForUpdate && checkNameForUpdate._id.toString() !== id)
				return {
					message: 'Club with this name already exists!',
					success: false,
					statusCode: 400,
				};

			const updatedClub = await this.clubRepository.update(id, club);

			return {
				message: 'Club updated!',
				success: updatedClub,
				statusCode: 200,
			} as Result;
		} catch (err) {
			const error: CustomError = new Error(err.message);
			error.statusCode = 500; // Internal Server Error
			throw error;
		}
	}
	async updateClubLogo(id: string, logo: Express.Multer.File, organizerId: string): Promise<Result> {
		try {
			const organizer = await this.userRepository.getById(organizerId);

			if (!organizer)
				return {
					message: 'Organizer not found!',
					success: false,
					statusCode: 404,
				};

			const clubToCheck = await this.clubRepository.get({ _id: id });

			if (!clubToCheck.isOrganizer(organizer._id))
				return {
					message: 'You are not authorized to update this club!',
					success: false,
					statusCode: 401,
				};

			if (!clubToCheck)
				return {
					message: 'Club not found!',
					success: false,
					statusCode: 404,
				};

			const extension = logo.mimetype.split('/')[1];
			const fileName = logo.filename.split('.')[0];
			const path = `media/profilePhotos/${fileName}.${extension}`;

			const updatedClub = await this.clubRepository.updateClubImage(id, path, null);

			return {
				message: 'Club logo updated!',
				success: updatedClub,
				statusCode: 200,
			};
		} catch (err) {
			const error: CustomError = new Error(err.message);
			error.statusCode = 500; // Internal Server Error
			throw error;
		}
	}
	async updateClubBanner(id: string, banner: Express.Multer.File, organizerId: string): Promise<Result> {
		try {
			const organizer = await this.userRepository.getById(organizerId);

			if (!organizer)
				return {
					message: 'Organizer not found!',
					success: false,
					statusCode: 404,
				};

			const clubToCheck = await this.clubRepository.get({ _id: id });

			if (!clubToCheck.isOrganizer(organizer._id))
				return {
					message: 'You are not authorized to update this club!',
					success: false,
					statusCode: 401,
				};

			if (!clubToCheck)
				return {
					message: 'Club not found!',
					success: false,
					statusCode: 404,
				};

			if (clubToCheck.banner) {
				clearImage(clubToCheck.banner);
			}

			// const extension = banner.mimetype.split('/')[1];
			const path = `media/profilePhotos/${banner.filename}`;

			const updatedClub = await this.clubRepository.updateClubImage(id, null, path);

			return {
				message: 'Club banner updated!',
				success: updatedClub,
				statusCode: 200,
			};
		} catch (err) {
			const error: CustomError = new Error(err.message);
			error.statusCode = 500; // Internal Server Error
			throw error;
		}
	}
	async updateClubPresident(id: string, presidentId: string, updatedPresidentId: string): Promise<Result> {
		try {
			const club = await this.clubRepository.get({ _id: id });
			if (!club)
				return {
					message: 'Club not found!',
					success: false,
					statusCode: 404,
				};

			const president: User = await this.userRepository.getById(presidentId);

			if (club.isPresident(president._id))
				return {
					message: 'You are not authorized to update this club!',
					success: false,
					statusCode: 401,
				};

			const presitendForUpdate: User = await this.userRepository.getById(updatedPresidentId);

			if (!presitendForUpdate)
				return {
					message: 'New president not found!',
					success: false,
					statusCode: 404,
				};

			const updatedClub = await this.clubRepository.updateClubPresident(id, updatedPresidentId);

			return {
				message: 'Club president updated!',
				success: updatedClub,
				statusCode: 200,
			};
		} catch (err) {
			const error: CustomError = new Error(err.message);
			error.statusCode = 500; // Internal Server Error
			throw error;
		}
	}
	async deleteClub(id: string, userId: string): Promise<Result> {
		try {
			const clubExist = await this.clubRepository.get({ _id: id });
			if (!clubExist)
				return {
					message: 'Club not found!',
					success: false,
					statusCode: 404,
				};

			const president = await this.userRepository.getById(userId);

			if (!president)
				return {
					message: 'President not found!',
					success: false,
					statusCode: 404,
				};

			if (clubExist.isPresident(president._id))
				return {
					message: 'You are not authorized to delete this club!',
					success: false,
					statusCode: 401,
				};

			const isDeleted: boolean = await this.clubRepository.delete(id);

			return {
				message: isDeleted ? 'Club deleted!' : 'Club deletion failed!',
				success: isDeleted,
				statusCode: isDeleted ? 200 : 500,
			};
		} catch (err) {
			const error: CustomError = new Error(err.message);
			error.statusCode = 500; // Internal Server Error
			throw error;
		}
	}
}
