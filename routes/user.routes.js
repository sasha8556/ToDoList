const express = require("express");
const router = express.Router();
const UsersController = require("../controller/user.controller");
const authenticateToken = require('../helpers/authenticate')



router.post("/register", UsersController.registerUser);

router.post("/login", UsersController.loginUser);

router.post("/todos",authenticateToken, UsersController.createTodo);

module.exports = router;
