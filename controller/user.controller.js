const UsersService = require("../services/user.services");

class UsersController {
  async registerUser(req, res) {
    try {
      let newUser = await UsersService.registerUser(req.body);
      res.status(201).json(newUser);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Ошибка регистрации пользователя" });
    }
  }
  async loginUser(req, res) {
    try {
      let foundUser = await UsersService.loginUser(req.body);
      res.status(200).json(foundUser);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Неправильный логин или пароль " });
    }
  }

  async createTodo(req, res) {
    try {
      const { title, isCompleted } = req.body;

      if (!title) {
        return res
          .status(400)
          .json({ message: "Недостаточно данных для создания таска" });
      }
      const { userId } = req.user;
      console.log(userId);

      const newTodo = await UsersService.createTodo({
        title,
        isCompleted: isCompleted || false,
        userId,
      });

      return res.status(201).json(newTodo);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Ошибка создания таска" });
    }
  }

  async getTasks(req, res) {
    try {
      const { userId } = req.user;
      const userTodos = await UsersService.getTasks(userId);
      res.send(userTodos);
    } catch (error) {
      console.log("Error: ", error);
      return res.status(500).json({ message: "Ошибка получения такса" });
    }
  }

  async updateTitle(req, res) {
    try {
      const { id } = req.params;
      const { title, taskId } = req.body;

      console.log("---id:", id);
      console.log("---taskId:", taskId);
      console.log("---title:", title);

      const updatedTodos = await UsersService.updateTitle(id, title, taskId);
      res.send(updatedTodos);
    } catch (error) {
      console.log("Error: ", error);
      return res.status(500).json({ message: "Ошибка изменения title" });
    }
  }

  async updateIsCompleted(req, res) {
    try {
      const { id } = req.params;
      const { taskId } = req.body;

      console.log("---id:", id);
      console.log("---taskId:", taskId);

      const updatedTodos = await UsersService.updateIsCompleted(id, taskId);
      res.send(updatedTodos);
    } catch (error) {
      console.log("Error: ", error);
      return res.status(500).json({ message: "Ошибка изменения IsCompleted" });
    }
  }


  async deleteTodoById(req, res) {
    try {
      const { id } = req.params;
      const { taskId } = req.body;

      console.log("---id:", id);
      console.log("---taskId:", taskId);

      const updatedTodos = await UsersService.deleteTodoById(id, taskId);
      res.send(updatedTodos);
    } catch (error) {
      console.log("Error: ", error);
      return res.status(500).json({ message: "Ошибка удаления такса" });
    }
  }
}

module.exports = new UsersController();
