import { Dto } from '../Dto';

export interface ClubForUpdateDto extends Dto {
	name: string;
	biography: string;
	status: boolean;
}
