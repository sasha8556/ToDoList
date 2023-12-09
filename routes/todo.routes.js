const express = require("express");
const router = express.Router();
const TodoController = require("../controller/todo.controller");
const authenticateToken = require("../helpers/authenticate");
const { body, header } = require("express-validator");

const validateDataBodyTodosTitle = [
  body("title").isString().withMessage("title must be a string"),
];

const validationToken = [
  header("authorization")
    .customSanitizer((value) => value.split(" ")[1])
    .isJWT()
    .withMessage("Invalid JWT token"),
];


/**
 * @swagger
 * /api/todos/:
 *  post:
 *      summary: Create new task.
 *      description: Adds new todo
 *      tags:
 *        - Todos
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        description: new todo
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                title:
 *                  type: string
 *                  description: todo's title
 *      responses:
 *          '200':
 *              description: Successful response
 *          '400':
 *              description: Bad request
 *          '401':
 *              description: Not authorized
 *          '403':
 *              description: Access error
 *          default:
 *              description: Error
 */

router.post(
  "/",
  authenticateToken,
  validateDataBodyTodosTitle,
  TodoController.createTodo
);

/**
 * @swagger
 * /api/todos/:
 *  get:
 *      summary: Get all tasks.
 *      description: Returns all todos.
 *      tags:
 *        - Todos
 *      security:
 *        - bearerAuth: []
 *      responses:
 *          '200':
 *              description: Successful response
 *          '400':
 *              description: Bad request
 *          '401':
 *              description: Not authorized
 *          '403':
 *              description: Access error
 *          default:
 *              description: Error
 */

router.get("/", authenticateToken, validationToken, TodoController.getTasks);

/**
 * @swagger
 * /api/todos/{id}:
 *   patch:
 *     summary: Partial task update.Title.
 *     description: Updates part of the task by ID. Changing the title property.
 *     tags:
 *       - Todos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: todo's id
 *         required: true
 *     requestBody:
 *       description: edited todo
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: todo's title
 *     responses:
 *          '200':
 *              description: Successful response
 *          '400':
 *              description: Bad request
 *          '401':
 *              description: Not authorized
 *          '403':
 *              description: Access error
 *          default:
 *              description: Error
 */

router.patch(
  "/:id",
  authenticateToken,
  validateDataBodyTodosTitle,
  TodoController.updateTitle
);

/**
 * @swagger
 * /api/todos/{id}/isCompleted:
 *   patch:
 *     summary: Partial task update isCompleted.
 *     description: Updates part of the task by ID.Switches todo's isCompleted.
 *     tags:
 *       - Todos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: todo's ID
 *         required: true
 *     responses:
 *         '200':
 *             description: Данные таски успешно обновлены.
 *         '400':
 *             description: Bad request
 *         '401':
 *             description: Not authorized
 *         '403':
 *             description: Access error
 *         default:
 *             description: Error
 */

router.patch(
  "/:id/isCompleted",
  authenticateToken,
  validationToken,
  TodoController.updateIsCompleted
);

/**
 * @swagger
 * /api/todos/{id}:
 *    delete:
 *      summary: Deletes todo.
 *      description: Deletes todo by ID.
 *      tags:
 *        - Todos
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - name: id
 *          in: path
 *          description: todo's ID
 *          required: true
 *      responses:
 *        200:
 *          description: Успешное удаление таски
 *        404:
 *          description: Таска с указанным идентификатором не найдена.
 *        500:
 *          description: Внутренняя ошибка сервера. Пожалуйста, попробуйте повторить запрос позже.
 */

router.delete(
  "/:id",
  authenticateToken,
  TodoController.deleteTodoById
);


module.exports = router;