import { before, describe } from "mocha";
import User from "../models/User";
import mongoose from "mongoose";

const MONGODB_URI = process.env.CONNECTION_STRING;

describe("Auth Controller Test", () => {
  before((done) => {
    mongoose
      .connect(MONGODB_URI)
      .then(() => {
        const user = new User({
          firstName: "test",
          lastName: "test",
          passwordHash: "test",
          email: "test@test.com",
          birthDate: "test",
          profilePicture: "test",
          university: "test",
          department: "test",
          studentId: "test",
          studentEmail: "test",
        });

        return user.save();
      })
      .then(() => {
        done();
      });
  });

  it("should throw error if user already exists", (done) => {
    const user = new User({
      firstName: "test",
      lastName: "test",
      passwordHash: "test",
      email: "test@test.com",

      birthDate: "test",
      profilePicture: "test",
      university: "test",
      department: "test",
      studentId: "test",
      studentEmail: "test",
    });
  });
});
