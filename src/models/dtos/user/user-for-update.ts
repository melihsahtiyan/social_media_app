import { Dto } from '../Dto';

export interface UserForUpdate extends Dto {
	password: string;
	studentEmail: string;
	university: string;
	department: string;
	profilePhotoUrl: string;
};
