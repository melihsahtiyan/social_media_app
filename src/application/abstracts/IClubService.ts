import { ClubInputDto } from '../../models/dtos/club/club-input-dto';
import { DataResult } from '../../types/result/DataResult';
import { Result } from '../../types/result/Result';
import { Club } from '../../models/entities/Club';
import { ClubForUpdateDto } from '../../models/dtos/club/club-for-update-dto';

export interface IClubService {
	createClub(club: ClubInputDto, logo: Express.Multer.File): Promise<Result>;
	getAllClubs(): Promise<DataResult<Array<Club>>>;
	getAllClubsByMemberId(userId: string): Promise<DataResult<Array<Club>>>;
	getClubById(id: string): Promise<DataResult<Club>>;
	updateClub(id: string, club: ClubForUpdateDto, organizerId: string): Promise<Result>;
	updateClubLogo(id: string, logo: Express.Multer.File, organizerId: string): Promise<Result>;
	updateClubBanner(id: string, banner: Express.Multer.File, organizerId: string): Promise<Result>;
	updateClubPresident(id: string, presidentId: string, updatedPresidentId: string): Promise<Result>;
	deleteClub(id: string, userId: string): Promise<Result>;
}
