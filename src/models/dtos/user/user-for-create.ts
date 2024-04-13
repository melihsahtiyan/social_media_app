interface UserForCreate {
  firstName: string;
  lastName: string;
  birthDate: Date;
  email: string;
  password: string;
  profilePicture?: string;
}

export default UserForCreate;
