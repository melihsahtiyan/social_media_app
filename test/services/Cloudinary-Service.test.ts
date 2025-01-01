import { CloudinaryService } from '../../src/application/services/cloudinary.service';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

describe('Cloudinary Service', () => {
	let cloudinaryService: CloudinaryService;

	beforeEach(() => {
		cloudinaryService = new CloudinaryService();

		jest.spyOn(cloudinary.uploader, 'upload').mockResolvedValue({
			secure_url: 'https://res.cloudinary.com/mock_folder/mock_subfolder/mock_file.jpg',
			public_id: 'mock_folder/mock_subfolder/mock_file'
		} as UploadApiResponse);
	});

	describe('handleUpload', () => {
		it('should upload a profile photo to cloudinary', async () => {
			const file = {
				buffer: Buffer.from('file'),
				mimetype: 'image/jpeg'
			} as Express.Multer.File;

			const result = await cloudinaryService.handleUpload(file, 'profilePhoto');
			expect(result).toBeDefined();
			expect(result).toBe('mock_folder/mock_subfolder/mock_file');
		});

		it('should upload an image to cloudinary', async () => {
			const file = {
				buffer: Buffer.from('file'),
				mimetype: 'image/png'
			} as Express.Multer.File;

			const result = await cloudinaryService.handleUpload(file, 'media');
			expect(result).toBeDefined();
			expect(result).toBe('mock_folder/mock_subfolder/mock_file');
		});

		it('should throw an error if the file type is invalid', async () => {
			const file = {
				buffer: Buffer.from('file'),
				mimetype: 'application/pdf'
			} as Express.Multer.File;

			await expect(cloudinaryService.handleUpload(file, 'profilePhoto')).rejects.toThrow('Invalid file type!');
		});
	});

	describe('handleDelete', () => {
		it('should delete a file from cloudinary', async () => {
			jest.spyOn(cloudinary.uploader, 'destroy').mockResolvedValue({ result: 'ok' });
			const result = await cloudinaryService.handleDelete('mock_folder/mock_subfolder/mock_file');
			expect(result).toBeTruthy();
		});
	});
});
