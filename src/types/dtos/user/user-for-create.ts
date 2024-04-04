interface UserForCreate {
  firstName: string;
  lastName: string;
  birthDate: Date;
  email: string;
  password: string;
  university: string;
  department: string;
  profilePicture?: string;
}

export default UserForCreate;
