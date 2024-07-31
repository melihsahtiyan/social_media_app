import { Request } from 'express';

declare module 'express' {
	interface Request {
		userId: string;
		files: Express.Multer.File[];
		file: Express.Multer.File;
	}
}

export default Request;
