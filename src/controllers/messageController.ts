import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import { MessageService } from '../services/messageService';
import { Response, NextFunction } from 'express';
import Request from '../types/Request';

@injectable()
export class MessageController {
	private readonly messageService: MessageService;

	constructor(@inject(MessageService) messageService: MessageService) {
		this.messageService = messageService;
	}

    async createMessage(req: Request, res: Response, next: NextFunction) {
        try {
            const message = req.body;
            const userId = req.userId;

            const result = await this.messageService.createMessage(userId, message, message.chatId);

            return res.status(result.statusCode).json(result);
        } catch (error) {
            next(error);
        }
    }

	async getAllMessagesByChatId(req: Request, res: Response, next: NextFunction) {
		try {
			const chatId = req.params.chatId;
			const messages = await this.messageService.getAllMessagesByChatId(chatId);
			
            return res.json(messages);
		} catch (error) {
			next(error);
		}
	}
}
