const express = require("express");
const router = express.Router();
const UsersController = require("../controller/user.controller");
const authenticateToken = require("../helpers/authenticate");
const { body, param, header } = require("express-validator");

const validateDataBodyUser = [
  body("login")
    .isString()
    .isLength({ min: 5 })
    .withMessage("login должен содержать минимум 5 символов"),
  body("password")
    .not()
    .equals(body("login"))
    .withMessage("Пароль не может быть таким же, как login"),
];

const validateDataBodyTodos = [
  body("title")
    .isString()
    .isLength({ min: 2 })
    .withMessage("Title должен содержать минимум 5 символов"),
  body("isCompleted")
    .isBoolean()
    .withMessage("isCompleted должен быть boolean"),
];

const validateDataUserId = [
  param("userId").isString().withMessage("userId должен быть в формате строки"),
];

const validateData = [
  header("Authorization").isJWT().withMessage("Invalid JWT token"),
];

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

router.post("/register", validateDataBodyUser, UsersController.registerUser);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Вход пользователя. Получение токена.
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

router.post("/login", validateDataBodyUser, UsersController.loginUser);

/**
 * @swagger
 * /api/users/todos:
 *    post:
 *      summary: Создать новую таску
 *      description: Созданая таска будет привязана в ID пользователя.
 *      tags:
 *        - Todos
 *      security:
 *         - jwtToken: []
 *      requestBody:
 *        $ref: "#/components/requestBodies/Todos"
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
 *               isCompleted:
 *                 type: boolean
 *                 example: false
 *                 description: Выполнена ли таска
 */

router.post(
  "/todos",
  authenticateToken,
  validateDataBodyTodos,
  validateData,
  UsersController.createTodo
);

/**
 * @swagger
 * /api/users/todos:
 *   get:
 *     summary: Получить список тасок
 *     description: Получение списка тасок из базы данных.
 *     tags:
 *       - Todos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Массив тасок
 * components:
 *   schemas:
 *     Todo:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           example: Закрыть 3-й чек-лист
 *         isCompleted:
 *           type: boolean
 *           example: false
 */

router.get("/todos", authenticateToken, validateData, UsersController.getTasks);

/**
 * @swagger
 * /api/users/todos/{id}:
 *   patch:
 *     summary: Частичное обновление таски
 *     description: Обновляет часть данных таски по его ID.
 *     tags:
 *       - Todos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Идентификатор таски.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               taskId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Данные таски успешно обновлены.
 */

router.patch(
  "/todos/:id",
  authenticateToken,
  validateDataBodyTodos,
  validateDataUserId,
  validateData,
  UsersController.updateTitle
);

/**
 * @swagger
 * /api/users/todos/{id}/isCompleted:
 *   patch:
 *     summary: Частичное обновление таски
 *     description: Обновляет часть данных таски по его ID. Метод автоматически изменит свойсво isCompleted на противоположное.
 *     tags:
 *       - Todos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Идентификатор таски.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               taskId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Данные таски успешно обновлены.
 */

router.patch(
  "/todos/:id/isCompleted",
  authenticateToken,
  validateData,
  validateDataBodyTodos,
  validateDataUserId,
  UsersController.updateIsCompleted
);

/**
 * @swagger
 * /api/users/todos/{id}:
 *    delete:
 *      summary: Удалить таску
 *      description: Удаление таски по ID.
 *      tags:
 *        - Todos
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: Идентификатор таски.
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                taskId:
 *                  type: string
 *      responses:
 *        200:
 *          description: Успешное удаление таски
 *        404:
 *          description: Таска с указанным идентификатором не найдена.
 *        500:
 *          description: Внутренняя ошибка сервера. Пожалуйста, попробуйте повторить запрос позже.
 */

router.delete(
  "/todos/:id",
  authenticateToken,
  validateData,
  validateDataUserId,
  UsersController.deleteTodoById
);

module.exports = router;
