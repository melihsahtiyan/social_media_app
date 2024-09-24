import { ObjectId } from '../../types/ObjectId';
import { Entity } from './Entity';

export class ClubEvent extends Entity {
	title: string;
	description: string;
	image: string;
	location: string;
	date: Date;
	time: string;
	club: ObjectId;
	organizer: ObjectId;
	isPublic: boolean;
	isOnline: boolean;
	attendees: ObjectId[];
	posts: ObjectId[];
	isUpdated: boolean;
	attendeeLimit?: number;

	constructor({
		title,
		description,
		image,
		location,
		date,
		time,
		club,
		organizer,
		isUpdated,
		isPublic,
		isOnline,
		attendeeLimit,
	}: {
		title: string;
		description: string;
		image?: string;
		location: string;
		date: Date;
		time: string;
		club: ObjectId;
		organizer: ObjectId;
		isUpdated: boolean;
		isPublic: boolean;
		isOnline: boolean;
		attendeeLimit?: number;
	}) {
		super();
		this.title = title;
		this.description = description;
		this.image = image;
		this.location = location;
		this.date = date;
		this.time = time;
		this.club = club;
		this.organizer = organizer;
		this.isPublic = isPublic;
		this.isOnline = isOnline;
		this.attendees = [];
		this.posts = [];
		this.isUpdated = isUpdated;
		this.attendeeLimit = attendeeLimit;
	}

	getClubId(): string {
		return this.club.toString();
	}

	getOrganizerId(): string {
		return this.organizer.toString();
	}
}
