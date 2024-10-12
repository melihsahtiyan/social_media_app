import { Dto } from '../Dto';
import { ObjectId } from '../../../types/ObjectId';

export interface ClubEventDetailDto extends Dto {
	title: string;
	description: string;
	image: string;
	location: string;
	date: Date;
	time: string;
	club: { _id: ObjectId; name: string };
	organizer: {
		_id: ObjectId;
		firstName: string;
		lastName: string;
	};
	isPublic: boolean;
	isOnline: boolean;
	attendees: {
		_id: ObjectId;
		firstName: string;
		lastName: string;
	}[];
	posts: ObjectId[];
	isUpdated: boolean;
	attendeeLimit?: number;
}
