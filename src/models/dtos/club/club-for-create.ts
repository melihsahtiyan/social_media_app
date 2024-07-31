import { Schema } from 'mongoose';

export interface ClubForCreate {
	name: string;
	logoUrl: string;
	bannerUrl: string;
	biography: string;
	status: boolean;
	president: Schema.Types.ObjectId;
	organizers: Schema.Types.ObjectId[];
	members: Schema.Types.ObjectId[];
}
