import { Dto } from '../Dto';

export interface ClubEventForUpdate extends Dto {
	description: string;
	image: string;
	location: string;
	date: Date;
	time: string;
	isPublic: boolean;
	isOnline: boolean;
}
