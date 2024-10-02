import 'reflect-metadata';
import { ChatService } from '../services/chatService';
import { NextFunction, Response } from 'express';
import Request from '../types/Request';
import { inject, injectable } from 'inversify';
import { isValid } from '../util/validationHandler';
import { Result } from '../types/result/Result';

@injectable()
export class ChatController {
	private chatService: ChatService;

	constructor(@inject(ChatService) chatService: ChatService) {
		this.chatService = chatService;
	}

	async createChat(req: Request, res: Response, next: NextFunction) {
		try {
			isValid(req);
			const members: string[] = req.body.members;
			const admin: string = req.userId;

			const result: Result = await this.chatService.createChat(admin, members);

			res.status(result.statusCode).json(result);
		} catch (err) {
			next(err);
		}
	}

	async getAllChats(req: Request, res: Response, next: NextFunction) {
		try {
			const result = await this.chatService.getAllChats();

			res.status(result.statusCode).json(result);
		} catch (err) {
			next(err);
		}
	}

	async getChatById(req: Request, res: Response, next: NextFunction) {
		try {
			isValid(req);
			const chatId: string = req.query.id as string;

			const result = await this.chatService.getChatById(chatId);

			res.status(result.statusCode).json(result);
		} catch (err) {
			next(err);
		}
	}
}
