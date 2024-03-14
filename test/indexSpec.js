"use strict";
process.env.NODE_ENV = "test";

const chaiHTTP = require("chai-http");
const chai = require("chai");
const app = require("../main.js");
chai.use(chaiHTTP);
const { expect } = chai;

describe("GET USERS", () => {
  it("should get all users", (done) => {
    chai
      .request(app)
      .get("/users")
      .end((errors, res) => {
        expect(res).to.have.status(200);
        expect(errors).to.be.equal(null);
        done();
      });
  });
});
