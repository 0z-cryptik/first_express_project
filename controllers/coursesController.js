"use strict";

const Course = require("../models/course");
const User = require("../models/user");

module.exports = {
  index: async (req, res, next) => {
    const courses = await Course.find();
    res.locals.offeredCourses = courses;
    next();
  },
  indexView: (req, res) => {
    res.status(200).render("courses/index");
  },
  indexJSON: (req, res) => {
    res.status(200).json(res.locals);
  },
  indexJSONView: (req, res) => {
    res.status(200).render("courses/indexAPI");
  },
  join: async (req, res, next) => {
    const { courseId } = req.params;
    const currentUser = req.user;

    if (currentUser) {
      try {
        await User.findByIdAndUpdate(currentUser._id, {
          $addToSet: {
            courses: courseId
          }
        });
        res.locals.success = true;
        next();
      } catch (err) {
        console.error(err);
        next(err);
      }
    } else {
      next(new Error("user must login"));
    }
  },
  filterUserCourses: (req, res, next) => {
    const currentUser = res.locals.currentUser;
    if (currentUser) {
      let mappedCourses = res.locals.offeredCourses.map((course) => {
        let userJoined = currentUser.courses.some((userCourse) =>
          userCourse.equals(course._id)
        );
        return Object.assign(course.toObject(), { joined: userJoined });
      });
      res.locals.offeredCourses = mappedCourses;
      next();
    } else {
      next();
    }
  }
};
