import 'reflect-metadata';
import { NextFunction, Response } 	from 'express';
import { inject, injectable } 		from 'inversify';
import Request 						from '../../types/Request';
import { DataResult } 				from '../../types/result/DataResult';
import { IMessageChunkService } 	from '../../types/services/IMessageChunkService';
import { isValid } 					from '../../util/validationHandler';
import { MessageChunk } 			from '../../models/entities/Chat/MessageChunk';
import { ServiceIdentifiers } 		from '../../application/constants/ServiceIdentifiers';

@injectable()
export class MessageChunkController {
	private readonly messageChunkService: IMessageChunkService;
	constructor(@inject(ServiceIdentifiers.IMessageChunkService) messageChunkService: IMessageChunkService) {
		this.messageChunkService = messageChunkService;
	}

	async getChunk(req: Request, res: Response, next: NextFunction) {
		try {
			isValid(req);
			const userId = req.userId;
			const chunkId = req.query.chunkId as string;
			const chunk: DataResult<MessageChunk> = await this.messageChunkService.getChunk(userId, chunkId);

			return res.status(chunk.statusCode).json(chunk);
		} catch (error) {
			next(error);
		}
	}

	async getChunksByChatId(req: Request, res: Response, next: NextFunction) {
		try {
			isValid(req);
			const userId = req.userId;
			const chatId = req.query.chatId as string;
			const chunks: DataResult<Array<MessageChunk>> = await this.messageChunkService.getAllChunksByChatId(userId, chatId);

			return res.status(chunks.statusCode).json(chunks);
		} catch (error) {
			next(error);
		}
	}

	async getAllChunks(req: Request, res: Response, next: NextFunction) {
		try {
			const chunks: DataResult<Array<MessageChunk>> = await this.messageChunkService.getAllChunks();

			return res.status(chunks.statusCode).json(chunks);
		} catch (error) {
			next(error);
		}
	}
}
