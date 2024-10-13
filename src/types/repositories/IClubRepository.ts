import { ClubDoc } from '../../models/schemas/club.schema';
import { Club } from '../../models/entities/Club';
import { IRepositoryBase } from './IRepositoryBase';

export interface IClubRepository extends IRepositoryBase<Club> {
	createClub(club: Club): Promise<Club>;
	getClubById(id: string): Promise<Club>;
	getClubByName(name: string): Promise<Club>;
	getClubs(): Promise<Club[]>;
	getClubByOrganizerId(organizerId: string): Promise<ClubDoc>;
	// searchClubByName(name: string): Promise<Club[]>;
	updateClubImage(id: string, logo?: string, banner?: string): Promise<boolean>;
	updateClubPresident(id: string, updatedPresidentId: string): Promise<boolean>;
}
