import { Dto } from '../Dto';

export interface UserForCreate extends Dto {
	firstName: string;
	lastName: string;
	birthDate: Date;
	email: string;
	studentEmail: string;
	password: string;
	profilePhotoUrl?: string;
	university: string;
	department: string;
}

export default UserForCreate;
