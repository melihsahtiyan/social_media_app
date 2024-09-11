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

	constructor({ name, biography, status, president }) {
		super();
		this.name = name;
		this.biography = biography;
		this.status = status;
		this.president = president;
		this.organizers = [president];
		this.members = [president];
		this.posts = [];
		this.events = [];
		this.createdAt = new Date(Date.now());
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
