interface UserForCreate {
	firstName: string;
	lastName: string;
	birthDate: Date;
	email: string;
	password: string;
	profilePhotoUrl?: string;
}

export default UserForCreate;
