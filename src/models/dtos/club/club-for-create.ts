import { Dto } from '../Dto';
import { ObjectId } from '../../../types/ObjectId';

export interface ClubForCreate extends Dto {
	name: string;
	logoUrl: string;
	bannerUrl: string;
	biography: string;
	status: boolean;
	president: ObjectId;
	organizers: ObjectId[];
	members: ObjectId[];
}
