import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import UserForRegister from '../models/dtos/user/user-for-register';
import { CustomError } from '../types/error/CustomError';
import UserForLogin from '../models/dtos/user/user-for-login';
import { UserRepository } from '../repositories/user-repository';
import UserForCreate from '../models/dtos/user/user-for-create';
import { Result } from '../types/result/Result';
import { DataResult } from '../types/result/DataResult';
import IAuthService from '../types/services/IAuthService';
import { User } from '../models/entites/User';
import jwt from 'jsonwebtoken';
import nodemailer, { Transporter } from 'nodemailer';
import { UserLoginResponse } from '../models/dtos/user/user-login-response';

@injectable()
export class AuthService implements IAuthService {
	_userRepository: UserRepository;
	constructor(@inject(UserRepository) userRepository: UserRepository) {
		this._userRepository = userRepository;
	}
	async register(userToRegister: UserForRegister): Promise<Result> {
		// TODO: profile picture addition will be on the update profile part
		// const profilePhotoUrl: string = req.file
		//   ? "/media/profilePhotos/" + req.file.filename
		//   : null;

		try {
			// Check the age of the user whether it is older than 18 or not (using birthDate)
			const age = new Date(Date.now()).getFullYear() - new Date(userToRegister.birthDate).getFullYear();

			if (age < 18) {
				const result: Result = {
					statusCode: 400,
					message: 'You must be 18 years old',
					success: false,
				};

				return result;
			}
			// Checking e-mail whether it exists.
			console.log('email: ', userToRegister.email);
			const userToCheck: User = await this._userRepository.getByEmail(userToRegister.email);

			if (userToCheck) {
				const result: Result = {
					statusCode: 409,
					message: 'User already exists',
					success: false,
				};

				return result;
			}

			const hashedPassword = await User.hashPassword(userToRegister.password);

			const userToCreate: UserForCreate = {
				...userToRegister,
				password: hashedPassword,
			};

			const isSent: boolean = await this.sendVerificationEmail(userToRegister.email, 'personal');

			if (isSent) {
				const result: Result = {
					statusCode: 500,
					message: 'Email could not be sent. Registration failed!',
					success: false,
				};

				return result;
			}

			await this._userRepository.create(userToCreate);

			const result: Result = {
				statusCode: 201,
				message: 'User registered successfully',
				success: true,
			};

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
			const error: CustomError = new Error(err.message);
			error.statusCode = err.statusCode || 500;
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
				host: 'stmp.gmail.com',
				auth: {
					type: 'OAuth2',
					user: process.env.VERFICATION_SERVICE_EMAIL,
					clientId: process.env.OAUTH_CLIENT_ID,
					clientSecret: process.env.OAUTH_CLIENT_SECRET,
					refreshToken: process.env.OAUTH_REFRESH_TOKEN,
				},
			});

			let isSent: boolean = false;
			transporter.sendMail(mailOptions, function (error, info) {
				if (error) {
					console.log(error);
					isSent = false;
				} else {
					console.log('Email sent: ' + info.response);
					isSent = true;
				}
			});

			return isSent;
		} catch (err) {
			const error: CustomError = new Error(err.message);
			error.statusCode = 500;
			throw error;
		}
	}
}
