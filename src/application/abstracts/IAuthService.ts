import UserForRegister from '../../models/dtos/user/user-for-register';
import UserForLogin from '../../models/dtos/user/user-for-login';
import { UserLoginResponse } from '../../models/dtos/user/user-login-response';
import { Result } from '../../types/result/Result';
import { DataResult } from '../../types/result/DataResult';

interface IAuthService {
	register(userToRegister: UserForRegister): Promise<Result>;

	login(userToLogin: UserForLogin): Promise<DataResult<UserLoginResponse>>;

	verifyEmail(email: string, verificationToken: string): Promise<Result>;

	sendVerificationEmail(email: string, verificationType: string): Promise<boolean>;
}

export default IAuthService;
