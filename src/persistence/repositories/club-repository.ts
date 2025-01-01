import 'reflect-metadata';
import { injectable } from 'inversify';
import { Club } from '../../models/entities/Club';
import { ClubDoc, clubs } from '../../models/schemas/club.schema';
import { IClubRepository } from '../abstracts/IClubRepository';
import { RepositoryBase } from './repository-base';

@injectable()
export class ClubRepository extends RepositoryBase<Club> implements IClubRepository {
	constructor() {
		super(clubs, Club);
	}
	public async createClub(club: Club): Promise<Club> {
		const createdClub: ClubDoc = await this.model.create({ ...club });

		return new Club(createdClub.toObject());
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
	public async updateClubImage(id: string, logo?: string, banner?: string): Promise<boolean> {
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

		return !!updatedClub;
	}

	public async updateClubPresident(id: string, updatedPresidentId: string): Promise<boolean> {
		const updatedClub: ClubDoc = await clubs.findByIdAndUpdate(
			id,
			{ president: updatedPresidentId, updatedAt: new Date(Date.now()) },
			{ new: true }
		);

		return !!updatedClub;
	}
}
