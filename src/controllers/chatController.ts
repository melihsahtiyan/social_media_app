import 'reflect-metadata';
import { ChatService } from '../services/chatService';
import { NextFunction, Response } from 'express';
import Request from '../types/Request';
import { inject, injectable } from 'inversify';
import { isValid } from '../util/validationHandler';
import { Result } from '../types/result/Result';
import { ChatForUpdate } from '../models/dtos/chat/chat-for-update';

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

	async getChatDetails(req: Request, res: Response, next: NextFunction) {
		try {
			isValid(req);
			const chatId: string = req.query.id as string;

			const result = await this.chatService.getChatDetails(chatId);

			res.status(result.statusCode).json(result);
		} catch (err) {
			next(err);
		}
	}

	async updateChat(req: Request, res: Response, next: NextFunction) {
		try {
			isValid(req);
			const userId: string = req.userId;
			const chatId: string = req.query.id as string;
			const chat: ChatForUpdate = req.body.chat;

			const result = await this.chatService.updateChat(userId, chatId, chat);

			res.status(result.statusCode).json(result);
		} catch (err) {
			next(err);
		}
	}

	async addChatMember(req: Request, res: Response, next: NextFunction) {
		try {
			isValid(req);
			const admin: string = req.userId;
			const chatId: string = req.query.id as string;
			const memberId: string = req.body.memberId;

			const result = await this.chatService.addChatMember(admin, chatId, memberId);

			res.status(result.statusCode).json(result);
		} catch (err) {
			next(err);
		}
	}

	async removeChatMember(req: Request, res: Response, next: NextFunction) {
		try {
			isValid(req);
			const admin: string = req.userId;
			const chatId: string = req.query.id as string;
			const memberId: string = req.body.memberId;

			const result = await this.chatService.removeChatMember(admin, chatId, memberId);

			res.status(result.statusCode).json(result);
		} catch (err) {
			next(err);
		}
	}

	async setChatAvatar(req: Request, res: Response, next: NextFunction) {
		try {
			isValid(req);
			const admin: string = req.userId;
			const chatId: string = req.query.id as string;
			const avatar: Express.Multer.File = req.file;

			const result = await this.chatService.setChatAvatar(admin, chatId, avatar);

			res.status(result.statusCode).json(result);
		} catch (err) {
			next(err);
		}
	}

	async deleteChat(req: Request, res: Response, next: NextFunction) {
		try {
			isValid(req);
			const admin: string = req.userId;
			const chatId: string = req.query.id as string;

			const result = await this.chatService.deleteChat(admin, chatId);

			res.status(result.statusCode).json(result);
		} catch (err) {
			next(err);
		}
	}
}
