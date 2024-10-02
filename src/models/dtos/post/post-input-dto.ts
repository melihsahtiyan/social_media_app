import { Poll } from '../../entities/Poll';

interface PostInputDto {
	caption: string;
	poll?: Poll;
}
export { PostInputDto };
