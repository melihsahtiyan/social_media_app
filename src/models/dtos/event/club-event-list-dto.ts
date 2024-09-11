import { ObjectId } from '../../../types/ObjectId';

export interface EventListDto {
	title: string;
	description: string;
	image: string;
	location: string;
	date: Date;
	time: string;
	club: { _id: ObjectId; name: string };
	isPublic: boolean;
	isOnline: boolean;
	attendeeCount: number;
	isUpdated: boolean;
}
