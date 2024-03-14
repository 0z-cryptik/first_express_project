const router = require("express").Router();
const errorController = require("../controllers/errorController");

//error handling middleware
router.use(errorController.noResourceFound);
router.use(errorController.internalError);

module.exports = router
