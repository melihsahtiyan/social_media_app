import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Request from '../types/Request';

const storage = multer.memoryStorage();

const singlePhotoStorage = multer.memoryStorage();

const photoFileFilter = (req: Request, file, cb) => {
	const imageMimetypes: Array<string> = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp', 'image/heic'];

	if (imageMimetypes.find(mimetype => mimetype === file.mimetype)) {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

const fileFilter = (req: Request, file, cb) => {
	const imageMimetypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp', 'image/heic', 'image/gif'];

	const videoMimetypes = ['video/mp4', 'video/mov', 'video/avi'];

	if (
		imageMimetypes.find(mimetype => mimetype === file.mimetype) ||
		videoMimetypes.find(mimetype => mimetype === file.mimetype)
	) {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

export const profilePhotoUpload = multer({
	storage: singlePhotoStorage,
	fileFilter: photoFileFilter,
});
export const mediaArrayUpload = multer({
	storage: storage,
	fileFilter: fileFilter,
});

export const singleMediaUpload = multer({
	storage: storage,
	fileFilter: fileFilter,
});

export const clearImage = (filePath: string) => {
	filePath = path.join(__dirname, '../..', filePath);
	fs.unlink(filePath, err => {
		if (err) {
			console.error('Error deleting file:', err);
			throw new Error('File deletion failed');
		}
	});
};
