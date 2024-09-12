import { ObjectId } from '../../types/ObjectId';
import { Entity } from './Entity';

export class Club extends Entity {
	name: string;
	logo: string;
	banner: string;
	biography: string;
	status: boolean;
	president: ObjectId;
	organizers: ObjectId[];
	members: ObjectId[];
	posts: ObjectId[];
	events: ObjectId[];

	constructor({
		name,
		biography,
		status,
		president,
		organizers,
		members,
		posts,
		events,
		logo,
		banner,
		createdAt,
	}: {
		name: string;
		biography: string;
		status: boolean;
		president: ObjectId;
		organizers: ObjectId[];
		members: ObjectId[];
		posts: ObjectId[];
		events: ObjectId[];
		logo: string;
		banner: string;
		createdAt: Date;
	}) {
		super();
		this.name = name;
		this.biography = biography;
		this.status = status;
		this.president = president;
		this.organizers = organizers;
		this.members = members;
		this.posts = posts;
		this.events = events;
		this.logo = logo;
		this.banner = banner;
		this.createdAt = createdAt;
	}

	getPresidentId(): string {
		return this.president.toString();
	}

	isOrganizer(userId: ObjectId): boolean {
		return this.organizers.includes(userId) ? true : false;
	}

	isPresident(userId: ObjectId): boolean {
		return this.president === userId ? true : false;
	}
}
