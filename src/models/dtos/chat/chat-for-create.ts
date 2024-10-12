import { ObjectId } from '../../../types/ObjectId';
import { Dto } from '../Dto';
export interface ChatForCreate extends Dto {
	members: string[];

	// Group chat
	isGroup: boolean;
	admins?: ObjectId[];
	title?: string;
}
