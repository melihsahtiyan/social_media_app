import { Dto } from '../Dto';
import { ObjectId } from '../../../types/ObjectId';

export interface ClubEventForCreate extends Dto {
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
	attendeeLimit?: number;
}
