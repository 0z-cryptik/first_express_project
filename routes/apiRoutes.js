const router = require("express").Router();
const coursesController = require("../controllers/coursesController");
const errorController = require("../controllers/errorController");
const userController = require("../controllers/userController");
const passport = require("passport");

//router.use(userController.verifyToken);
router.post("/login", passport.authenticate('local'), userController.apiAuthenticate);

router.use(userController.verifyJWT)

router.get(
  "/courses",
  coursesController.index,
  coursesController.filterUserCourses,
  coursesController.indexJSON
);

router.get(
  "/courses/:courseId/join",
  coursesController.join,
  coursesController.indexJSON
);



router.use(errorController.errorJSON);

module.exports = router;
