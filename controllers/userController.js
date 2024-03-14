"use strict";

const User = require("../models/user");
const { query, body, validationResult } = require("express-validator");
const passport = require("passport");
const token = "recipeT0k3N";
const JWT = require("jsonwebtoken");

const getUserParams = (body) => ({
  name: {
    first: body.firstName,
    last: body.lastName
  },
  email: body.email,
  password: body.password,
  zipCode: parseInt(body.zipCode)
});

module.exports = {
  getUserParams: (body) => ({
    name: {
      first: body.firstName,
      last: body.lastName
    },
    email: body.email,
    password: body.password,
    zipCode: parseInt(body.zipCode)
  }),
  login: (req, res, next) => {
    try {
      res.render("users/login");
    } catch (err) {
      console.log(err);
      req.flash("error", "cannot find the login page");
      next();
    }
  },
  logout: (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "logged out successfully");
      res.locals.redirect = "/users/login";
      next();
    });
  },
  authenticate: passport.authenticate("local", {
    failureRedirect: "/users/login",
    failureFlash: "Failed to login",
    successRedirect: "/users",
    successFlash: "logged in successfully"
  }),
  apiAuthenticate: (req, res, next) => {
    let user = req.user;
    if (user) {
      let signedToken = JWT.sign(
        {
          data: user._id,
          exp: new Date().setDate(new Date().getDate() + 1)
        },
        "secret-encoding-passphrase"
      );
      res.status(200).json({ success: true, token: signedToken });
    } else {
      res.json({
        success: false,
        message: "couldn't authebnticate user"
      });
    }
  },
  verifyJWT: (req, res, next) => {
    const token = req.headers.token;

    if (token) {
      JWT.verify(
        token,
        "secret-encoding-passphrase",
        async (errors, payload) => {
          if (payload) {
            const user = await User.findById(payload.data);
            if (user) {
              next();
            } else {
              res
                .status(403)
                .json({ error: true, message: "no user account found" });
            }
          } else {
            res.status(401).json({
              error: true,
              message: "cannot verify API token"
            });
            next();
          }
        }
      );
    } else {
      res.status(401).json({
        error: true,
        message: "provide API token"
      });
    }
  },
  validate: (req, res, next) => {
    body("email").trim().notEmpty().isLowercase().isEmail();
    body("zipCode").notEmpty().isInt().isLength({
      min: 5,
      max: 5
    });
    body("password").notEmpty();

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let messages = errors.array.map((e) => e.msg);
      req.skip = true;
      req.flash("error", messages.join(" and "));
      res.locals.redirect = "/";
      next();
    } else {
      next();
    }
  },
  create: (req, res) => {
    try {
      res.status(200).render("users/newUser");
    } catch (err) {
      console.error(err);
    }
  },
  index: async (req, res, next) => {
    try {
      const allUsers = await User.find({});
      res.locals.users = allUsers;
      next();
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
  indexView: (req, res) => {
    res.status(200).render("users/index");
  },
  indexJson: (req, res) => {
    try {
      const { users } = res.locals;
      res.status(200).json({ success: true, data: users });
    } catch (err) {
      console.error(err);
    }
  },
  createNewUser: async (req, res, next) => {
    const { password } = req.body;

    try {
      const newUserDetails = new User(getUserParams(req.body));
      User.register(newUserDetails, password, (error, user) => {
        if (user) {
          req.flash(
            "success",
            `${user.fullName()}'s account created successfully`
          );
          res.locals.redirect = "/users";
          next();
        } else {
          next();
        }
      });
    } catch (err) {
      console.error(err);
      res.locals.redirect = "/";
      req.flash(
        "error",
        `failed to create new accout, error message: ${err.message}`
      );
      next();
    }
  },
  redirectView: (req, res, next) => {
    const redirectPath = res.locals.redirect;
    if (redirectPath) {
      res.redirect(redirectPath);
    } else {
      next();
    }
  },
  show: async (req, res, next) => {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId);
      res.locals.user = user;
      next();
    } catch (err) {
      next(err);
    }
  },
  showView: (req, res) => {
    res.status(200).render("users/show");
  },
  edit: (req, res) => {
    res.status(200).render("users/edit");
  },
  update: async (req, res, next) => {
    try {
      const { userId } = req.params;
      const newDetails = getUserParams(req.body);
      const user = await User.findByIdAndUpdate(userId, {
        $set: newDetails
      });
      res.locals.user = user;
      res.locals.redirect = `/users/${userId}`;
      next();
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
  delete: async (req, res, next) => {
    try {
      const { userId } = req.params;
      await User.findByIdAndRemove(userId);
      res.locals.redirect = "/users";
      next();
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
  verifyToken: async (req, res, next) => {
    const { apiToken } = req.query;
    if (apiToken) {
      const validUser = await User.findOne({ apiToken });
      if (validUser) {
        next();
      } else {
        next(new Error("Invalid API token"));
      }
    } else {
      next(new Error("Invalid API token"));
    }
  }
};
