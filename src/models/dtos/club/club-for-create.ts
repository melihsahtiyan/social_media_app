import { ObjectId } from '../../../types/ObjectId';

export interface ClubForCreate {
	name: string;
	logoUrl: string;
	bannerUrl: string;
	biography: string;
	status: boolean;
	president: ObjectId;
	organizers: ObjectId[];
	members: ObjectId[];
}
