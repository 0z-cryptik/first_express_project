"use strict";
process.env.NODE_ENV = "test";

const userController = require("../controllers/userController.js");
const { expect } = require("chai");

describe("userController", () => {
  describe("getUserParams", () => {
    it("should convert the req.body into a details object of the user", () => {
      const bodySample = {
        firstName: "Jon",
        lastName: "Wrexler",
        email: "jon@gmail.com",
        password: "djhhjbd",
        zipCode: 12345
      };
      expect(userController.getUserParams(bodySample)).to.deep.include({
        name: {
          first: "Jon",
          last: "Wrexler"
        }
      });
    });
    it("should return an empty object when given an empty body", () => {
      const emptyBody = {};
      expect(userController.getUserParams(emptyBody)).to.deep.include({});
    });
  });
});
