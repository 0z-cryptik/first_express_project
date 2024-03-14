const router = require("express").Router();
const homeRoutes = require("./homeRoutes");
const userRoutes = require("./userRoutes");
const subsRoute = require("./subsRoute");
const coursesRoutes = require("./coursesRoutes");
const errorRoutes = require("./errorRoutes");
const apiRoutes = require("./apiRoutes");

router.use("/users", userRoutes);
router.use("/subscribers", subsRoute);
router.use("/error", errorRoutes);
router.use("/courses", coursesRoutes);
router.use("/api", apiRoutes);
router.use("/", homeRoutes);
router.use("/", errorRoutes);

module.exports = router;
