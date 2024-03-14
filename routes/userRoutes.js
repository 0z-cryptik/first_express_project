const router = require("express").Router();
const userController = require("../controllers/userController");

router.post(
  "/create",
  userController.createNewUser,
  userController.redirectView
);

router.post("/login", userController.authenticate);
router.get("/create", userController.create);
router.get("/login", userController.login);
router.get(
  "/logout",
  userController.logout,
  userController.redirectView
);

router.get("/", userController.index, userController.indexView);
router.get("/json", userController.index, userController.indexJson);
router.get("/:userId", userController.show, userController.showView);
router.get(
  "/:userId/edit",
  userController.show,
  userController.edit
);

//PUT routes
router.put(
  "/:userId/update",
  userController.update,
  userController.redirectView
);

//DELETE routes
router.delete(
  "/:userId/delete",
  userController.delete,
  userController.redirectView
);

module.exports = router;
