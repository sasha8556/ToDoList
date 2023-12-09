const express = require("express");
const router = express.Router();

const todosRoutes = require("./todo.routes");
const usersRoutes = require("./user.routes");

router.use("/users", usersRoutes);
router.use("/todos", todosRoutes);

module.exports = router;