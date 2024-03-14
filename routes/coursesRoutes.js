const router = require("express").Router();
const coursesController = require("../controllers/coursesController");

router.get("/", coursesController.index, coursesController.indexView);
router.get('/api', coursesController.indexJSONView)

module.exports = router;
