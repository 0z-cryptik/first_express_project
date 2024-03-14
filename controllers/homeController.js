"use strict";

const fs = require("fs").promises;

module.exports = {
  sendReqParams: (req, res) => {
    let veg = req.params.vegetable;
    res.send(`this is the page for ${veg}`);
  },
  sendHomepage: async (req, res) => {
    try {
      const homepage = await fs.readFile(
        "./public/homepage.html",
        "utf-8"
      );
      res.status(200).send(homepage);
    } catch (error) {
      res.send("unable to serve this file");
      console.log(error);
    }
  },
  create: (req, res) => {
    try {
      res.redirect("/users/create");
    } catch (err) {
      console.error(err);
    }
  },
  homepagePostHandler: (req, res) => {
    console.log(req.body);
    res.send("Posted successfully");
  },
  logMiddlewear: (req, res, next) => {
    console.log(`a request was made to the following path: ${req.url}`);
    next();
  },
  signUpGetHandler: (req, res) => {
    console.log(req.query);
    res.render("sign_up");
  },
  respondWithName: (req, res) => {
    let paramsName = req.params.myName;
    res.render("name", { name: paramsName });
  },
  contactRoute: (req, res) => {
    let paramsName = req.params.myName;
    res.render("contact", { name: paramsName });
  },
  chatView: (req, res, next) => {
    res.render('chat/chat')
  }
};
