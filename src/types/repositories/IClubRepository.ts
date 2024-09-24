import { ClubDoc } from '../../models/schemas/club.schema';
import { ClubForUpdateDto } from '../../models/dtos/club/club-for-update-dto';
import { Club } from '../../models/entities/Club';

export interface IClubRepository {
	createClub(club: Club): Promise<Club>;
	getById(id: string): Promise<Club>;
	getClubById(id: string): Promise<Club>;
	getClubByName(name: string): Promise<Club>;
	getClubs(): Promise<Club[]>;
	getClubByOrganizerId(organizerId: string): Promise<ClubDoc>;
	// searchClubByName(name: string): Promise<Club[]>;
	updateClub(id: string, club: ClubForUpdateDto): Promise<Club>;
	updateClubImage(id: string, logo?: string, banner?: string): Promise<Club>;
	updateClubPresident(id: string, updatedPresidentId: string): Promise<Club>;
	deleteClub(id: string): Promise<boolean>;
}
