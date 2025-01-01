import { Dto } from '../Dto';

export default interface UserForRegister extends Dto {
	firstName: string;
	lastName: string;
	birthDate: Date;
	email: string;
	studentEmail: string;
	password: string;
	university: string;
	department: string;
}
