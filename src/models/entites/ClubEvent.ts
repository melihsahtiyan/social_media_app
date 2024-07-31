import { Schema } from 'mongoose';
import { Entity } from './Entity';

export class ClubEvent extends Entity {
	title: string;
	description: string;
	image: string;
	location: string;
	date: Date;
	time: string;
	club: Schema.Types.ObjectId;
	organizer: Schema.Types.ObjectId;
	isPublic: boolean;
	isOnline: boolean;
	attendees: Schema.Types.ObjectId[];
	posts: Schema.Types.ObjectId[];
	isUpdated: boolean;

	constructor({
		title,
		description,
		image,
		location,
		date,
		time,
		club,
		organizer,
		isPublic,
		isOnline
	}: {
		title: string;
		description: string;
		image?: string;
		location: string;
		date: Date;
		time: string;
		club: Schema.Types.ObjectId;
		organizer: Schema.Types.ObjectId;
		isPublic: boolean;
		isOnline: boolean;
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
		this.isUpdated = false;
	}

	getClubId(): string {
		return this.club.toString();
	}
}
