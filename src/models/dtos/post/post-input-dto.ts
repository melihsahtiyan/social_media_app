import { Poll } from '../../../models/entites/Poll';

interface PostInputDto {
	caption: string;
	poll?: Poll;
}
export { PostInputDto };
