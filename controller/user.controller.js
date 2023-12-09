const UsersService = require("../services/user.services");
const { validationResult } = require("express-validator");
const Sentry = require("@sentry/node");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

class UsersController {
  async getUser(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).send({ errors: errors.array() });
      }
      const user = await UsersService.getUser();
      return res.send(user);
    } catch (error) {
      Sentry.captureException(error);
    }
  }
  async registerUser(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { login, password } = req.body;
      const allUsers = await UsersService.getUser();
      const existingUser = allUsers.some((user) => user.login === login);

      if (existingUser) {
        return res
          .status(201)
          .json({ error: "Пользователь с таким login уже существует" });
      }
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const newUser = { id: uuidv4(), login, password: hashedPassword };
      let result = await UsersService.registerUser(newUser);
      res.status(201).json(result);
    } catch (error) {
      Sentry.captureException(error);
    }
  }
  async loginUser(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      } else {
        const { login, password } = req.body;
        const allUsers = await UsersService.getUser();
        const user = allUsers.find((item) => item.login === login);
        if (!user) {
          reject("Неверный login");
          return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          reject("Неверный пароль");
        }
        const token = jwt.sign(
          { userId: user.id },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "1h",
          }
        );
        res.status(200).send({ token: token });
      }
    } catch (error) {
      console.log(error);
      Sentry.captureException(error);
    }
  }
}

module.exports = new UsersController();
