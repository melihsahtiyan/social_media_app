import { Dto } from '../Dto';

export interface UserLoginResponse extends Dto {
	token: string;
	id: string;
	profilePhotoUrl: string;
}
