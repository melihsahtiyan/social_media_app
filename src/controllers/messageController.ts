import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import { Response, NextFunction } from 'express';
import Request from '../types/Request';
import { IMessageService } from '../types/services/IMessageService';
import TYPES from '../util/ioc/types';
import { MessageForCreate } from '../models/dtos/message/message-for-create';
import { MessageTypes } from '../models/entities/enums/messageEnums';

@injectable()
export class MessageController {
	private readonly messageService: IMessageService;

	constructor(@inject(TYPES.IMessageService) messageService: IMessageService) {
		this.messageService = messageService;
	}

	async createMessage(req: Request, res: Response, next: NextFunction) {
		try {
			const message: MessageForCreate = req.body;
			const media: Express.Multer.File = req?.file;
			const userId = req.userId;

			console.log(message);

			console.log(media);

			if (
				// If message type is text and content is not provided
				(message.type === MessageTypes.TEXT && !message.content) ||
				// If message type is media and media is not provided
				(message.type === MessageTypes.MEDIA && !media)
			) {
				return res.status(422).json({ success: false, message: 'Content or media is required', statusCode: 422 });
			}

			const result = await this.messageService.createMessage(userId, message, message.chatId.toString(), media);

			return res.status(result.statusCode).json(result);
		} catch (error) {
			next(error);
		}
	}

	async getAllMessagesByChatId(req: Request, res: Response, next: NextFunction) {
		try {
			const chatId = req.query.chatId as string;
			const messages = await this.messageService.getAllMessagesByChatId(chatId);

			return res.status(messages.statusCode).json(messages);
		} catch (error) {
			next(error);
		}
	}

	async getAllMessagesByChunkId(req: Request, res: Response, next: NextFunction) {
		try {
			const chunkId = req.query.chunkId as string;
			const messages = await this.messageService.getAllMessagesByChunkId(chunkId);

			return res.status(messages.statusCode).json(messages);
		} catch (error) {
			next(error);
		}
	}
}
