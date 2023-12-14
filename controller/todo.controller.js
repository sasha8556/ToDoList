const TodoService = require("../services/todo.services");
const { validationResult } = require("express-validator");
const Sentry = require("@sentry/node");
const { v4: uuidv4 } = require("uuid");


class TodoController {
  async createTodo(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title } = req.body;

      if (!title) {
        return res
          .status(400)
          .json({ message: "Недостаточно данных для создания таска" });
      }
      const { userId } = req.user;

      const newTask = {
        id: uuidv4(),
        title: title,
        isCompleted: false,
        userId: userId,
      };

      await TodoService.createTodo({ id: uuidv4(), ...newTask });
      return res.send(newTask).status(201);
    } catch (error) {
      console.error(error);
      Sentry.captureException(error);
    }
  }

  async getTasks(req, res) {
    try {
      const errors = validationResult(req);
      const { userId } = req.user;
      const userTodos = await TodoService.getTasks(userId);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
      } else {
        res.send(userTodos);
      }
    } catch (error) {
      console.log("Error: ", error);
      Sentry.captureException(error);
    }
  }

  async updateTitle(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
        const { id } = req.params;
        const { title } = req.body;

        const updatedTodos = await TodoService.updateTitle(id, title);
        res.status(200).json(updatedTodos);
      
    } catch (error) {
      console.log("Error: ", error);
      Sentry.captureException(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async updateIsCompleted(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;

      const updatedTodos = await TodoService.updateIsCompleted(id);
      res.send(updatedTodos).status(200);
    } catch (error) {
      console.log("Error: ", error);
      Sentry.captureException(error);
    }
  }

  async deleteTodoById(req, res) {
    try {
      const { id } = req.params;

      const updatedTodos = await TodoService.deleteTodoById(id);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
      } else {
        res.send(updatedTodos).status(200);
      }
    } catch (error) {
      console.log("Error: ", error);
      Sentry.captureException(error);
    }
  }
}

module.exports = new TodoController();
