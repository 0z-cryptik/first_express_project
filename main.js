"use strict";

const express = require("express");
const methodOverride = require("method-override");
const homeController = require("./controllers/homeController");
const layouts = require("express-ejs-layouts");
const passport = require("passport");
let port;

if (process.env.NODE_ENV === "test") {
  port = 3001;
} else {
  port = process.env.PORT || 3008;
}
const expressSession = require("express-session");
const cookieParser = require("cookie-parser");
const connectFlash = require("connect-flash");
const User = require("./models/user");
const router = require("./routes/index");
const app = express();
const mongoose = require("mongoose");
const Subscriber = require("./models/subscribers");
const Course = require("./models/course");

const server = app.listen(port, () =>
  console.log(`look alive! listening on port ${port}`)
);

if (process.env.NODE_ENV === "test") {
  mongoose.connect("mongodb://127.0.0.1:27017/recipe_test_db", {
    useNewUrLParser: true
  });
} else {
  mongoose.connect("mongodb://127.0.0.1:27017/recipe_db", {
    useNewUrLParser: true
  });
}

mongoose.Promise = global.Promise;

const db = mongoose.connection;

db.once("open", () => {
  console.log("connected to database successfully");
});

const io = require("socket.io")(server);
require("./controllers/chatController")(io);

app.set("view engine", "ejs");
app.set("token", process.env.TOKEN || "recipeT0k3N");

//middleware
app.use(cookieParser("rubberDuck1"));

app.use(
  expressSession({
    secret: "rubberDuck2",
    cookie: {
      maxAge: 4000000
    },
    resave: false,
    saveUninitialized: false
  })
);

app.use(connectFlash());

app.use(
  methodOverride("_method", {
    methods: ["POST", "GET"]
  })
);
app.use(homeController.logMiddlewear);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(layouts);
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  res.locals.loggedIn = req.isAuthenticated();
  res.locals.currentUser = req.user;
  next();
});
app.use(express.static("./public"));
app.use(express.static("./public/css"));
app.use(express.static("./public/js"));

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/", router);

module.exports = app;

/*let user;
const userFunc = async () => {
  await User.create({
    name: {
      first: "Jonathan",
      last: "wrexler"
    },
    email: "jon@jonwrexler.com",
    password: "pass123"
  })
    .then((newUser) => {
      return Subscriber.findOne({ email: newUser.email });
    })
    .then((sub) => {
      user.subscribedAccount = sub;
      user.save();
    })
    .catch((error) => console.log(error.message));
  console.log(user);
};

//userFunc();

const subAttacher = async (user) => {
  const subscriber = await Subscriber.findOne({ email: user.email });
  if (subscriber) {
    user.subscribedAccount = subscriber;
    user.save();
    console.log(user);
  }
};

const findJon = async () => {
  const Jon = await User.findOne({ email: "jon@jonwrexler.com" });
  subAttacher(Jon);
};

//findJon();

const findUsers = async () => {
  const allUsers = await User.find().populate("subscribedAccount").exec();
  console.log(allUsers);
};

//findUsers()

/*const saveModels = async () => {
  const course = new Course({
    title: "Tomatoe101",
    description: "Locally farmed tomatoes only",
    zipCode: 12345,
    items: ["eba", "semovita"]
  });

  await course.save();

  const subs = await new Subscriber({
    name: "Lamidi Ajani",
    email: "lamidi@gmail.com",
    phone_no: 8687235896,
    courses: course._id
  });

  await subs.save()
}

const getRandomNumber = () => {
  const randomFloater = Math.random();
  const randomNumber = Math.floor(randomFloater * 3);
  return randomNumber;
};

const modelsFunc = async () => {
  try {
    const theCourse = await Subscriber.findOne({ name: "Lamidi Ajani" })
      .populate("courses")
      .exec();
    console.log(theCourse);
  } catch (error) {
    console.error(error);
  }
};

//modelsFunc();

const createNewCourses = async () => {
  await Course.create({
    title: "Farm Fresh Salad",
    description:
      "A refreshing salad made with locally sourced, organic ingredients.",
    zipCode: 54321,
    items: [
      "mixed greens",
      "cherry tomatoes",
      "cucumbers",
      "balsamic vinaigrette"
    ]
  });
  await Course.create({
    title: "Grilled Salmon Delight",
    description:
      "Juicy grilled salmon seasoned to perfection, served with a side of roasted vegetables.",
    zipCode: 23456,
    items: ["grilled salmon", "roasted potatoes", "seasonal vegetables"]
  });
  await Course.create({
    title: "Pasta Paradise",
    description:
      "Delicious pasta dish with homemade marinara sauce and a variety of toppings.",
    zipCode: 34567,
    items: [
      "penne pasta",
      "marinara sauce",
      "parmesan cheese",
      "fresh basil"
    ]
  });
  await Course.create({
    title: "Vegan Delight Bowl",
    description:
      "A nourishing bowl filled with quinoa, kale, avocado, and a tangy tahini dressing.",
    zipCode: 45678,
    items: ["quinoa", "kale", "avocado", "tahini dressing"]
  });
  await Course.create({
    title: "Sushi Extravaganza",
    description:
      "Savor the flavors of freshly prepared sushi rolls featuring a variety of fish and vegetables.",
    zipCode: 56789,
    items: ["sushi rice", "salmon", "avocado", "seaweed", "soy sauce"]
  });
};

//createNewCourses();

const allSubs = async () => {
  let subs = await Subscriber.find();
  return subs;
};

const allCourses = async () => {
  let courses = await Course.find();
  return courses;
};

const coursesPusher = async () => {
  const subs = await allSubs();
  const courses = await allCourses();

  subs.forEach((subscriber) => {
    subscriber.courses.push(courses[getRandomNumber()]._id);
    subscriber.save();
  });
};

//coursesPusher()

const populateAllSubs = async () => {
  let subs = await Subscriber.find().populate("courses").exec();
  console.log(subs);
};

//populateAllSubs();

const createNewSubs = async () => {
  await Subscriber.create({
    name: "Sule Akingbade",
    email: "sule202@gmail.com",
    phone_no: 8687235896
  });

  await Subscriber.create({
    name: "James Milner",
    email: "james@gmail.com",
    phone_no: 8687235896
  });

  await Subscriber.create({
    name: "Diamond black",
    email: "diamond1950@gmail.com",
    phone_no: 8687235896
  });

  await Subscriber.create({
    name: "kareem Yoghurt",
    email: "yoyo@gmail.com",
    phone_no: 8687235896
  });

  await Subscriber.create({
    name: "Jonathan Wrexler",
    email: "jon@jonwrexler.com",
    phone_no: 659362876
  });
};

//createNewSubs();

const findAlan = async () => {
  try {
    const alan = await Subscriber.findOne({ name: "Alan Pardew" }).where(
      "email",
      /pardew/
    );
    console.log(alan);
  } catch (error) {
    console.error(error);
  }
};

//findAlan();

const findUser = async (email) => {
  const user = await User.findOne({ email });
  console.log(user);
};

//findUser('sule202@gmail.com')

*/
