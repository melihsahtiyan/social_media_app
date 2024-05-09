import mongoose from "mongoose";
import { describe, it } from "mocha";
import { expect } from "chai";
import sinon from "sinon";

const MONGODB_URI = process.env.TEST_CONNECTION_STRING;

describe("Auth Controller", function () {
  before((done) => {
    mongoose
      .connect(MONGODB_URI)
      .then(() => {
        // const user = new User({
        //   firstName: "test",
        //   lastName: "test",
        //   password: "test",
        //   email: "test@test.com",
        //   birthDate: "test",
        //   profilePhotoUrl: null,
        //   university: "test",
        //   department: "test",
        // });

        // return user.save();
      })
      .then(() => {
        done();
      });
  });

  it("should throw error if user already exists", function (done) {
    // const findOne = sinon.stub(User, "findOne");
    // findOne.throws();

    // const user = new User({
    //   firstName: "test",
    //   lastName: "test",
    //   password: "test",
    //   email: "test@test.com",
    //   birthDate: "test",
    //   profilePhotoUrl: null,
    //   university: "test",
    //   department: "test",
    //   studentEmail: "test",
    // });

    // user.save().catch((err) => {
    //   expect(err).to.exist;
    //   done();
    // });
  });
});
