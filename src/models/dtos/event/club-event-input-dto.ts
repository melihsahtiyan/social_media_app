export interface ClubEventInputDto {
	title: string;
	description: string;
	location: string;
	date: Date;
	time: string;
	club: string;
	isPublic: boolean;
	isOnline: boolean;
}
