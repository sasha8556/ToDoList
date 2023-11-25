const express = require("express");
const router = express.Router();
const UsersController = require("../controller/user.controller");
const authenticateToken = require("../helpers/authenticate");

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Регистрация нового пользователя
 *     description: Создает нового пользователя с использованием предоставленных данных
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               login:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *             required:
 *               - login
 *               - password
 *     responses:
 *       '201':
 *         description: Пользователь успешно зарегистрирован
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User' # ссылка на схему ответа пользователя
 *       '500':
 *         description: Ошибка регистрации пользователя
 */

router.post("/register", UsersController.registerUser);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Вход пользователя
 *     description: Аутентификация пользователя с использованием предоставленных учетных данных
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               login:
 *                 type: string
 *                 format: login
 *               password:
 *                 type: string
 *                 format: password
 *             required:
 *               - login
 *               - password
 *     responses:
 *       '200':
 *         description: Успешный вход пользователя
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User' # ссылка на схему пользователя
 *       '500':
 *         description: Неправильный логин или пароль
 */
  

router.post("/login", UsersController.loginUser);

/**
 * @swagger
 * /api/users/todos:
 *    post:
 *      summary: Создать новую таску
 *      description: Любое описание...
 *      tags:
 *        - Todos
 *      security:
 *         - bearerAuth: []
 *      responses:
 *        200:
 *          description: Таска успешно создана
 * components:
 *   requestBodies:
 *     Todos:
 *       description: Свойства таски, которые были добавлены.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Дописать ToDoList
 *                 description: Название таски
 *               isActive:
 *                 type: boolean
 *                 example: false
 *                 description: Активна ли таска
 */


router.post("/todos", authenticateToken, UsersController.createTodo);

router.get("/todos", authenticateToken, UsersController.getTasks);

router.patch("/todos/:id", authenticateToken, UsersController.updateTitle);

router.patch(
  "/todos/:id/isCompleted",
  authenticateToken,
  UsersController.updateIsCompleted
);

router.delete("/todos/:id", authenticateToken, UsersController.deleteTodoById);

module.exports = router;
