import { Dto } from '../Dto';

export interface UserForCreate extends Dto {
	firstName: string;
	lastName: string;
	birthDate: Date;
	email: string;
	password: string;
	profilePhotoUrl?: string;
}

export default UserForCreate;
