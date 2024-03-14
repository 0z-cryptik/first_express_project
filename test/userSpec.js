"use strict";

process.env.NODE_ENV = "test";

const User = require("../models/user");
const chai = require("chai");
const mongoose = require("mongoose");
const { expect } = chai;
require("../main");

beforeEach((done) => {
  User.deleteMany({}).then(() => {
    done();
  });
});

describe("SAVE user", () => {
  it("should save a user", (done) => {
    let testUser = new User({
      name: {
        first: "Jon",
        last: "Wexler"
      },
      email: "Jon@jonwexler.com",
      password: 12345,
      zipCode: 10016
    });
    testUser.save().then(() => {
      User.find({}).then((result) => {
        expect(result.length).eq(1);
        expect(result[0]).to.have.property("_id");
        done();
      });
    });
  });
});

describe("SAVE user", () => {
  it("should save a user", async () => {
    let testUser = {
      name: {
        first: "Jon",
        last: "Wexler"
      },
      email: "Jon@jonwexler.com",
      password: 12345,
      zipCode: 10016
    };

    await User.create(testUser);
    const result = await User.find({});

    expect(result.length).to.equal(1);
    expect(result[0]).to.have.property("_id");
  });
});
