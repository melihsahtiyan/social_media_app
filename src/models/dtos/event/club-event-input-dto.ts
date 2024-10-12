import { Dto } from '../Dto';

export interface ClubEventInputDto extends Dto {
	title: string;
	description: string;
	location: string;
	date: Date;
	time: string;
	club: string;
	isPublic: boolean;
	isOnline: boolean;
	attendeeLimit?: number;
}
