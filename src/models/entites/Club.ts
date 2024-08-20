import { Schema } from 'mongoose';
import { Entity } from './Entity';

export class Club extends Entity {
	name: string;
	logo: string;
	banner: string;
	biography: string;
	status: boolean;
	president: Schema.Types.ObjectId;
	organizers: Schema.Types.ObjectId[];
	members: Schema.Types.ObjectId[];
	posts: Schema.Types.ObjectId[];
	events: Schema.Types.ObjectId[];

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

	isOrganizer(userId: Schema.Types.ObjectId): boolean {
		return this.organizers.includes(userId) ? true : false;
	}

	isPresident(userId: Schema.Types.ObjectId): boolean {
		return this.president === userId ? true : false;
	}
}
