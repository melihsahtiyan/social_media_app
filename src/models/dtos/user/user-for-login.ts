import { Dto } from '../Dto';

export default interface UserForLogin extends Dto {
	email: string;
	password: string;
}
