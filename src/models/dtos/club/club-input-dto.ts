import { Dto } from '../Dto';

export interface ClubInputDto extends Dto {
	name: string;
	biography: string;
	status: boolean;
	president: string;
}
