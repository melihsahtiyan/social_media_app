import { Poll } from '../../models/entities/Poll';
import { ObjectId } from '../../types/ObjectId';
import { IRepositoryBase } from './IRepositoryBase';

export interface IPollRepository extends IRepositoryBase<Poll> {
	create(poll: Poll): Promise<boolean>;
	vote(pollId: ObjectId, userId: ObjectId, option: string): Promise<boolean>;
	deleteVote(pollId: ObjectId, userId: ObjectId, option: string): Promise<boolean>;
	delete(id: string): Promise<boolean>;
}
