import { Express, Request, Response } from 'express';
import isAuth from '../middleware/is-auth';
import * as fs from 'fs';

// const imageMimetypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp', 'image/heic', 'image/gif'];

// const videoMimetypes = ['video/mp4', 'video/mov', 'video/avi'];

function routes(app: Express) {
	app.post('/download-media', isAuth, (req: Request, res: Response) => {
		console.info('----------------------------------------------------');
		console.info('fileController.download: started');
		const mediaUrl = req.body.mediaUrl;
		console.info('mediaUrl: ', mediaUrl);
		const file = fs.createReadStream(mediaUrl);
		const filename = new Date().toISOString();
		res.setHeader('Content-Disposition', 'attachment: filename="' + filename + '"');
		file.pipe(res);
	});

	app.get('/logs/exceptions', (req: Request, res: Response) => {
		const logs = fs.readFileSync('./logs/exceptions.log', 'utf8');
		res.json(logs);
	});

	app.get('/logs/combined', (req: Request, res: Response) => {
		const logs = fs.readFileSync('./logs/combined.log', 'utf8');
		res.json(logs);
	});

	app.get('/logs/errors', (req: Request, res: Response) => {
		const logs = fs.readFileSync('./logs/errors.log', 'utf8');
		res.json(logs);
	});
}

export default routes;
