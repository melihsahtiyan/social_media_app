import 'reflect-metadata';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { ICloudinaryService } from '../types/services/ICloudinaryService';
import { injectable } from 'inversify';
import { CustomError } from '../types/error/CustomError';
import dotenv from 'dotenv';
dotenv.config();

@injectable()
export class CloudinaryService implements ICloudinaryService {
	constructor() {
		cloudinary.config({
			cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
			api_key: process.env.CLOUDINARY_API_KEY,
			api_secret: process.env.CLOUDINARY_API_SECRET,
		});
	}
	async handleUpload(file: Express.Multer.File, type: string): Promise<string> {
		let folder: string;

		const extension: string = file.mimetype.split('/')[1];
		const videoExtensions = ['mp4', 'mov', 'avi', 'mkv', 'webm', 'm4v'];
		const imageExtensions = ['jpg', 'jpeg', 'png', 'webp', 'heic', 'gif'];

		switch (type) {
			case 'profilePhoto':
				if (!imageExtensions.includes(extension)) {
					const error: CustomError = new CustomError(
						'Invalid file type! Profile photo must be an image.',
						422,
						null,
						'CloudinaryService',
						'handleUpload'
					);
					throw error;
				}
				folder = 'profilePhotos/';
				break;
			case 'avatar':
				if (!imageExtensions.includes(extension)) {
					const error: CustomError = new CustomError(
						'Invalid file type! Profile photo must be an image.',
						422,
						null,
						'CloudinaryService',
						'handleUpload'
					);
					throw error;
				}
				folder = 'avatars/';
				break;
			case 'media':
				if (videoExtensions.includes(extension)) {
					folder = 'media/videos/';
				} else if (imageExtensions.includes(extension)) {
					folder = 'media/images/';
				} else {
					const error: CustomError = new CustomError(
						'Invalid file type!',
						422,
						null,
						'CloudinaryService',
						'handleUpload'
					);
					throw error;
				}
				break;
			case 'messages':
				folder = 'messages/';
				if (!imageExtensions.includes(extension) && !videoExtensions.includes(extension)) {
					const error: CustomError = new CustomError(
						'Invalid file type!',
						422,
						null,
						'CloudinaryService',
						'handleUpload'
					);
					throw error;
				}
				break;
			default: {
				const error: CustomError = new CustomError(
					'Invalid file type!',
					422,
					null,
					'CloudinaryService',
					'handleUpload'
				);
				throw error;
			}
		}

		const fileBuffer = file.buffer.toString('base64');
		const dataURI = 'data:' + file.mimetype + ';base64,' + fileBuffer;

		try {
			const result: UploadApiResponse = await cloudinary.uploader.upload(dataURI, {
				resource_type: 'auto',
				folder: folder,
			});

			// const res: string = result.secure_url;
			// console.log('File Upload:', res);

			// const publicId: string = res.split('/')[7] + '/' + res.split('/')[8] + '/' + res.split('/')[9].split('.')[0];
			return result.public_id;
		} catch (error) {
			throw new Error(error.stack || error.message);
		}
	}

	async handleDelete(publicId: string): Promise<boolean> {
		const res: boolean = await cloudinary.uploader
			.destroy(publicId)
			.then(result => {
				console.log('Result: ', result);
				console.log('Result public Id: ', publicId);

				return result;
			})
			.catch(error => {
				throw error.stack;
			});

		console.log(res);

		return res;
	}
}
