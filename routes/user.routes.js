const express = require("express");
const router = express.Router();
const UsersController = require("../controller/user.controller");
const authenticateToken = require('../helpers/authenticate')



router.post("/register", UsersController.registerUser);

router.post("/login", UsersController.loginUser);

router.post("/todos",authenticateToken, UsersController.createTodo);

router.get("/todos",authenticateToken,UsersController.getTasks);

router.patch("/todos/:id",authenticateToken,UsersController.updateTitle);

router.patch("/todos/:id/isCompleted",authenticateToken,UsersController.updateIsCompleted);

router.delete("/todos/:id",authenticateToken,UsersController.deleteTodoById);

module.exports = router;
