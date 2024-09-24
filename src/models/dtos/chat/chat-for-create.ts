import { ObjectId } from '@/types/ObjectId';

export interface ChatForCreate {
	members: ObjectId[];

	// Group chat
	isGroup: boolean;
	admins?: ObjectId[];
	title?: string;
}
