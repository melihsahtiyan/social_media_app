import mongoose, { Schema, Model } from 'mongoose';
import { PostDoc, postSchema } from './post.schema';
import { Poll } from '../entities/Poll';

export type PollDoc = PostDoc & Poll;

export const pollSchema = new Schema<PollDoc>({
	...postSchema.obj,
	question: { type: String, required: true },
	options: [{ optionName: String, votes: [Schema.Types.ObjectId] }],
	totalVotes: { type: Number, default: 0 },
	expiresAt: { type: Date, required: true },
});

const polls: Model<PollDoc> = mongoose.models.polls || mongoose.model<PollDoc>('Poll', pollSchema);

export { polls };
