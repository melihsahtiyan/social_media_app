import mongoose from 'mongoose';
import { ClubEvent } from '../entites/ClubEvent';
export type ClubEventDoc = mongoose.Document & ClubEvent;

export const clubEventSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	description: {
		type: String
	},
	image: {
		type: String
	},
	location: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		required: true
	},
	time: {
		type: String
	},
	club: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Club',
		required: true
	},
	organizer: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	isPublic: {
		type: Boolean
	},
	isOnline: {
		type: Boolean
	},
	attendees: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			default: []
		}
	],
	posts: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Post',
			default: []
		}
	],
	isUpdated: {
		type: Boolean,
		default: false
	},
	createdAt: {
		type: Date,
		default: Date.now()
	},
	updatedAt: {
		type: Date,
		default: null
	}
});

const clubEvents: mongoose.Model<ClubEventDoc> =
	mongoose.models.events || mongoose.model<ClubEventDoc>('ClubEvent', clubEventSchema);

export { clubEvents };
