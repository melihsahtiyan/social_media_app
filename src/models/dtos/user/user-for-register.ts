import { Dto } from '../Dto';

export default interface UserForRegister extends Dto {
	firstName: string;
	lastName: string;
	birthDate: Date;
	email: string;
	password: string;
}

