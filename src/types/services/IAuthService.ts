import UserForRegister from '../../models/dtos/user/user-for-register';
import { Result } from '../result/Result';
import UserForLogin from '../../models/dtos/user/user-for-login';
import { DataResult } from '../result/DataResult';
import { UserLoginResponse } from '../../models/dtos/user/user-login-response';

interface IAuthService {
	register(userToRegister: UserForRegister): Promise<Result>;

	login(userToLogin: UserForLogin): Promise<DataResult<UserLoginResponse>>;

	verifyEmail(email: string, verificationToken: string): Promise<Result>;

	sendVerificationEmail(email: string, verificationType: string): Promise<boolean>;
}

export default IAuthService;
