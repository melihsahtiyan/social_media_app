import { Dto } from '../Dto';

export interface ChatForUpdate extends Dto {
	// Details
	description?: string;

	// Group chat
	isGroup: boolean;
	title?: string;
}
