import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import UserForRegister from '../models/dtos/user/user-for-register';
import { CustomError } from '../types/error/CustomError';
import UserForLogin from '../models/dtos/user/user-for-login';
import UserForCreate from '../models/dtos/user/user-for-create';
import { Result } from '../types/result/Result';
import { DataResult } from '../types/result/DataResult';
import IAuthService from '../types/services/IAuthService';
import { User } from '../models/entities/User';
import jwt from 'jsonwebtoken';
import nodemailer, { Transporter } from 'nodemailer';
import { UserLoginResponse } from '../models/dtos/user/user-login-response';
import IUserRepository from '../types/repositories/IUserRepository';
import TYPES from '../util/ioc/types';

@injectable()
export class AuthService implements IAuthService {
	private readonly _userRepository: IUserRepository;
	constructor(@inject(TYPES.IUserRepository) userRepository: IUserRepository) {
		this._userRepository = userRepository;
	}
	async register(userToRegister: UserForRegister): Promise<Result> {
		try {
			// Check the age of the user whether it is older than 18 or not (using birthDate)
			const age = new Date(Date.now()).getFullYear() - new Date(userToRegister.birthDate).getFullYear();

			if (age < 18) {
				return { statusCode: 400, message: 'You must be 18 years old', success: false };
			}
			// Checking e-mail whether it exists.
			const userToCheck: User = await this._userRepository.getByEmail(userToRegister.email);
			if (userToCheck) {
				return { statusCode: 409, message: 'User already exists', success: false };
			}

			const hashedPassword = await User.hashPassword(userToRegister.password);

			const userToCreate: UserForCreate = { ...userToRegister, password: hashedPassword };
			// TODO: Handle the case where the verification email is not sent. Suggestions: send the verification email again or delete the user
			await this._userRepository.create(userToCreate);

			// const isSent: boolean = await this.sendVerificationEmail(userToRegister.email, 'personal');

			// if (!isSent) {
			// 	return { statusCode: 500, message: 'Email could not be sent. Registration failed!', success: false };
			// }

			const result: Result = { statusCode: 201, message: 'User registered successfully', success: true };

			return result;
		} catch (err) {
			const error: CustomError = new Error(err.message);
			error.statusCode = 500; // Internal Server Error
			throw error;
		}
	}

	async login(userToLogin: UserForLogin): Promise<DataResult<UserLoginResponse>> {
		try {
			const user: User = await this._userRepository.getByEmail(userToLogin.email);
			if (!user) {
				const result: DataResult<UserLoginResponse> = {
					statusCode: 401,
					message: 'Email or password is incorrect!',
					success: false,
				};
				return result;
			}

			const isEqual: boolean = await user.comparePassword(userToLogin.password);

			if (!isEqual) {
				const result: DataResult<UserLoginResponse> = {
					statusCode: 401,
					message: 'Email or password is incorrect',
					success: false,
				};
				return result;
			}

			if (!user.hasVerifiedEmail()) {
				const result: DataResult<UserLoginResponse> = {
					statusCode: 400,
					message: 'Email is not verified! You must verify your email!!',
					success: false,
				};
				return result;
			}

			const token = user.generateJsonWebToken();

			if (!user.isVerifiedStudent()) {
				await this.sendVerificationEmail(user.studentEmail, 'student');

				const result: DataResult<UserLoginResponse> = {
					statusCode: 400,
					message: 'Student email is not verified! Please verify your student email',
					success: false,
					data: {
						token: token,
						id: user._id.toString(),
						profilePhotoUrl: user.profilePhotoUrl,
					},
				};

				return result;
			}

			const result: DataResult<UserLoginResponse> = {
				statusCode: 200,
				message: 'Login successful! Token generated',
				data: {
					token: token,
					id: user._id.toString(),
					profilePhotoUrl: user.profilePhotoUrl,
				},
				success: true,
			};

			return result;
		} catch (err) {
			const error: CustomError = new CustomError(err.message, 500, ['Internal Server Error']);
			throw error;
		}
	}

	async verifyEmail(email: string, verificationToken: string): Promise<Result> {
		const decodedToken = jwt.verify(verificationToken, process.env.JWT_SECRET) as {
			email: string;
			verificationType: string;
		};

		if (decodedToken.email !== email) {
			const error: CustomError = new Error('Invalid token');
			error.statusCode = 400; // Bad Request
			throw error;
		}

		const user: User = await this._userRepository.getByEmail(email);

		if (!user) {
			const error: CustomError = new Error('User not found');
			error.statusCode = 404; // Not Found
			throw error;
		}

		let message: string;
		if (decodedToken.verificationType === 'personal') {
			// TODO: send verification link to the user's student email if this is from personal email
			user.status.emailVerification = true;
			this._userRepository.update(user._id.toString(), user);
			message = 'Personal mail verified! Please verify your student mail';
		}

		if (decodedToken.verificationType === 'student') {
			user.status.studentVerification = true;
			this._userRepository.update(user._id.toString(), user);
			message = 'Student mail verified!';
		}

		const result: Result = {
			statusCode: 200,
			message: message,
			success: true,
		};

		return result;
	}

	async sendVerificationEmail(email: string, verificationType: string): Promise<boolean> {
		try {
			// TODO: Implement this function
			// send verification link to the user's email

			const verificationToken = await this._userRepository.generateVerificationToken(email, verificationType);

			const mailOptions: nodemailer.SendMailOptions = {
				from: process.env.VERIFICATION_SERVICE_EMAIL,
				to: email,
				subject: 'Verification Email',
				text: `Click the link to verify your email: ${process.env.VERIFICATION_SERVICE_URL}/auth/verify-email?token=${verificationToken}?email=${email}`,
			};

			const transporter: Transporter = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					type: 'OAuth2',
					user: process.env.VERIFICATION_SERVICE_EMAIL,
					clientId: process.env.OAUTH_CLIENT_ID,
					clientSecret: process.env.OAUTH_CLIENT_SECRET,
					refreshToken: process.env.OAUTH_REFRESH_TOKEN,
				},
			});

			await transporter.sendMail(mailOptions);
			return true;
		} catch (error) {
			console.error('Error sending verification email:', error);
			return false;
		}
	}
}
