const router = require("express").Router();
const subsController = require("../controllers/subscriberController");

router.post(
  "/create",
  subsController.createNewSubscriber,
  subsController.redirectView
);

//GET routes

router.get("/", subsController.index, subsController.indexView);
router.get("/new", subsController.create);
router.get(
  "/json",
  subsController.index,
  subsController.indexJson
);
router.get(
  "/:subscriberId",
  subsController.show,
  subsController.showView
);

router.get(
  "/:subscriberId/edit",
  subsController.show,
  subsController.edit
);

//PUT routes
router.put(
  "/:subscriberId/update",
  subsController.update,
  subsController.redirectView
);

//DELETE routes
router.delete(
  "/:subscriberId/delete",
  subsController.delete,
  subsController.redirectView
);

module.exports = router
