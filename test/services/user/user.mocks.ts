import mongoose from "mongoose";
import { User } from "../../../src/models/entities/User";


const initialUserMocks = [
    new User({
        _id: new mongoose.Schema.Types.ObjectId('MockId'),
        firstName: 'John',
        lastName: 'Doe',
        birthDate: new Date(),
        email: 'john.doe@example.com',
        password: 'password123',
        university: 'Mocked University',
        department: 'Mocked Department',
        studentEmail: 'john.doe@student.example.com',
        status: { studentVerification: false, emailVerification: false },
        profilePhotoUrl: "mockedProfilePhotoUrl",
        friends: [],
        friendRequests: [],
        posts: [],
        organizations: [],
        attendances: [],
        createdAt: new Date(),
    }),
    new User({
        _id: new mongoose.Schema.Types.ObjectId('MockId2'),
        firstName: 'Jane',
        lastName: 'Doe',
        birthDate: new Date(),
        email: 'jane.doe@example.com',
        password: 'password123',
        university: 'Mocked University',
        department: 'Mocked Department',
        studentEmail: 'jane.doe@student.example.com',
        status: { studentVerification: false, emailVerification: false },
        profilePhotoUrl: null,
        friends: [],
        friendRequests: [],
        posts: [],
        organizations: [],
        attendances: [],
        createdAt: new Date(),
    }),
];

export const userMocks = {
    initialUserMocks,
};