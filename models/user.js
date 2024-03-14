"use strict";

const mongoose = require("mongoose");
const Subscriber = require("./subscribers");
const passportLocalMongoose = require("passport-local-mongoose");
const randToken = require("rand-token");

const userSchema = mongoose.Schema(
  {
    name: {
      first: {
        type: String,
        trim: true,
        required: true
      },
      last: {
        type: String,
        trim: true,
        required: true
      }
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true
    },
    zipCode: {
      type: Number,
      min: [1000, "zipCode is too short"],
      max: 99999
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
      }
    ],
    subscribedAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscriber"
    },
    apiToken: {
      type: String
    }
  },
  { timestamps: true }
);

userSchema.plugin(passportLocalMongoose, {
  usernameField: "email"
});

const assignSubAcc = function (next) {
  let user = this;
  if (user.subscribedAccount === undefined) {
    Subscriber.findOne({ email: user.email })
      .then((subscriber) => {
        user.subscribedAccount = subscriber;
        next();
      })
      .catch((err) => {
        console.log(`error assigning subscribed account ${err}`);
        next(err);
      });
  } else {
    next();
  }
};

userSchema.pre("save", assignSubAcc);

const assignApiToken = function (next) {
  let user = this;
  if (!user.apiToken) {
    user.apiToken = randToken.generate(16);
    next();
  }
};

//userSchema.pre("save", assignApiToken);

userSchema.methods.fullName = function () {
  let user = this;
  return `${user.name.first} ${user.name.last}`;
};

module.exports = mongoose.model("User", userSchema);
