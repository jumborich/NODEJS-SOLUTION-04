const router = require("express").Router();
const userController = require("../controllers/users");


// add user
router
.post("/add", userController.addUser);

// get user
router
.get("/view/:id?", userController.view);

// update user
router
.patch("/edit/:id", userController.update)

module.exports = router;