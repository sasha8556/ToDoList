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
      res.status(500).json({message:"Неправильный логин или пароль "});
    }
  }

  async createTodo  (req, res) {

    try {
      const { title, isCompleted} = req.body;
    
      if (!title || !isCompleted) {
        return res.status(400).json({ message: 'Недостаточно данных для создания таска' });
      }
      const userId = req.user;
      console.log(userId);

      const newTodo = await UsersService.createTodo({
        title,
        isCompleted: true || false, 
        userId
      });

      return res.status(201).json(newTodo);
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Ошибка создания таска' });
    }
  }
}

module.exports = new UsersController();
