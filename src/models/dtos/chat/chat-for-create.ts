import { ObjectId } from '../../../types/ObjectId';

export interface ChatForCreate {
	members: string[];

	// Group chat
	isGroup: boolean;
	admins?: ObjectId[];
	title?: string;
}
