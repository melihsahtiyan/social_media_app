import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import { Response, NextFunction } from 'express';
import Request from '../../types/Request';
import { IMessageService } from '../../types/services/IMessageService';
import TYPES from '../../util/ioc/types';
import { MessageForCreate } from '../../models/dtos/message/message-for-create';
import { MessageTypes } from '../../models/entities/enums/messageEnums';
import { isValid } from '../../util/validationHandler';

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
			const userId = req.userId;
			const chatId = req.query.chatId as string;
			const messages = await this.messageService.getAllMessagesByChatId(userId, chatId);

			return res.status(messages.statusCode).json(messages);
		} catch (error) {
			next(error);
		}
	}

	async getAllMessagesByChunkId(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.userId;
			const chunkId = req.query.chunkId as string;
			const messages = await this.messageService.getAllMessagesByChunkId(userId, chunkId);

			return res.status(messages.statusCode).json(messages);
		} catch (error) {
			next(error);
		}
	}

	async updateMessage(req: Request, res: Response, next: NextFunction) {
		try {
			isValid(req);
			const userId = req.userId;
			const messageId = req.body.messageId;
			const content = req.body.content;

			const result = await this.messageService.updateMessage(userId, messageId, { content });

			return res.status(result.statusCode).json(result);
		} catch (error) {
			next(error);
		}
	}

	async deleteMessage(req: Request, res: Response, next: NextFunction) {
		try {
			isValid(req);
			const userId = req.userId;
			const messageId = req.query.id as string;

			const result = await this.messageService.deleteMessage(userId, messageId);

			return res.status(result.statusCode).json(result);
		} catch (error) {
			next(error);
		}
	}
}
