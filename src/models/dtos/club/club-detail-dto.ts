import { ObjectId } from '../../../types/ObjectId';

export interface ClubDetailDto {
	name: string;
	logo: string;
	banner: string;
	biography: string;
	status: boolean;
	president: {
		_id: ObjectId;
		firstName: string;
		lastName: string;
	};
	organizers: {
		_id: ObjectId;
		firstName: string;
		lastName: string;
	}[];
	members: {
		_id: ObjectId;
		firstName: string;
		lastName: string;
	}[];
	posts: ObjectId[];
	events: ObjectId[];
}
