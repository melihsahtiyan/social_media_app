import { ClubDoc } from '../../models/schemas/club.schema';
import { ClubForUpdateDto } from '../../models/dtos/club/club-for-update-dto';
import { Club } from '../../models/entites/Club';

export interface IClubRepository {
	createClub(club: Club): Promise<Club>;
	getById(id: string): Promise<Club>;
	getClubById(id: string): Promise<Club>;
	getClubByName(name: string): Promise<Club>;
	getClubs(): Promise<Club[]>;
	getClubByOrganizerId(organizerId: string): Promise<ClubDoc>;
	// searchClubByName(name: string): Promise<Club[]>;
	updateClub(id: string, club: ClubForUpdateDto): Promise<ClubForUpdateDto>;
	updateClubImage(id: string, logo?: string, banner?: string): Promise<ClubForUpdateDto>;
	updateClubPresident(id: string, updatedPresidentId: string): Promise<ClubForUpdateDto>;
	deleteClub(id: string): Promise<Club>;
}
