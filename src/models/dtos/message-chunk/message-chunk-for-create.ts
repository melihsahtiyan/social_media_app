import { Dto } from '../Dto';

export interface MessageChunkForCreate extends Dto {
	chat: string;
	nextChunk?: string;
};
