import { Poll } from '../../entities/Poll';
import { Dto } from '../Dto';

export interface PostInputDto extends Dto {
	caption: string;
	poll?: Poll;
}
