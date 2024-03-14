"use strict";

const express = require("express");
const methodOverride = require("method-override");
const homeController = require("./controllers/homeController");
const layouts = require("express-ejs-layouts");
const passport = require("passport");
const port = process.env.PORT || 3008;
const expressSession = require("express-session");
const cookieParser = require("cookie-parser");
const connectFlash = require("connect-flash");
const User = require("./models/user");
const router = require("./routes/index");
const app = express();

const server = app.listen(port, () =>
  console.log(`look alive! listening on port ${port}`)
);
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
