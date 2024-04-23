import UserForRegister from "../../models/dtos/user/user-for-register";
import { Result } from "../result/Result";
import UserForLogin from "../../models/dtos/user/user-for-login";
import { DataResult } from "../result/DataResult";

interface IAuthService {
  register(userToRegister: UserForRegister): Promise<Result>;

  login(userToLogin: UserForLogin): Promise<DataResult<String>>;

  // verifyEmail(token: string): Promise<Result>;

  // sendVerificationEmail(email: string, verificationType: string): Promise<Result>;
}

export default IAuthService;
