import { injectable } from 'inversify';
import { Club } from '../models/entities/Club';
import { ClubDoc, clubs } from '../models/schemas/club.schema';
import { IClubRepository } from '../types/repositories/IClubRepository';
import { ClubForUpdateDto } from '../models/dtos/club/club-for-update-dto';

@injectable() /* TODO extends BaseRepository<Club>  */
export class ClubRepository implements IClubRepository {
	public async createClub(club: Club): Promise<Club> {
		const createdClub: ClubDoc = await clubs.create({ ...club });

		return new Club(createdClub.toObject());
	}
	public async getById(id: string): Promise<Club> {
		return await clubs.findById(id);
	}
	public async getClubById(id: string): Promise<Club> {
		return await clubs
			.findById(id)
			.populate('president', 'firstName lastName email profilePicture university department')
			.populate('organizers', 'firstName lastName email profilePicture university department');
	}
	async getClubByName(name: string): Promise<Club> {
		const club: ClubDoc = await clubs.findOne({ name });

		return new Club(club.toObject());
	}
	public async getClubs(): Promise<Club[]> {
		return await clubs
			.find()
			.populate('president', 'firstName lastName email profilePicture university department')
			.populate('organizers', 'firstName lastName email profilePicture university department');
	}
	async getClubByOrganizerId(organizerId: string): Promise<ClubDoc> {
		return await clubs.findOne({ organizers: organizerId });
	}
	public async updateClub(id: string, club: ClubForUpdateDto): Promise<Club> {
		const updatedClub: ClubDoc = await clubs.findByIdAndUpdate(
			id,
			{ ...club, updatedAt: new Date(Date.now()) },
			{ new: true }
		);

		return new Club(updatedClub.toObject());
	}
	public async updateClubImage(id: string, logo?: string, banner?: string): Promise<Club> {
		const club: Club = await clubs.findById(id);

		const updatedClub: ClubDoc = await clubs.findByIdAndUpdate(
			id,
			{
				logo: logo ? logo : club.logo,
				banner: banner ? banner : club.banner,
				updatedAt: new Date(Date.now()),
			},
			{ new: true }
		);

		return new Club(updatedClub.toObject());
	}

	public async updateClubPresident(id: string, updatedPresidentId: string): Promise<Club> {
		const updatedClub: ClubDoc = await clubs.findByIdAndUpdate(
			id,
			{ president: updatedPresidentId, updatedAt: new Date(Date.now()) },
			{ new: true }
		);

		return new Club(updatedClub.toObject());
	}
	public async deleteClub(id: string): Promise<boolean> {
		const isDeleted: boolean = await clubs.findByIdAndDelete(id);

		return isDeleted;
	}
}
