const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const data = "./data.json";
let users = [];


if (fs.existsSync(data)) {
  const dataUsers = fs.readFileSync("data.json", "utf8");
  const parsedUsers = JSON.parse(dataUsers);
  users.push(...parsedUsers);
}

class UsersService {
  registerUser(info) {
    return new Promise(async (resolve, reject) => {
      try {
        const { login, password } = info;
        const existingUser = users.some((user) => user.login === login);
        if (existingUser) {
          reject("Пользователь с таким login уже существует");
          return;
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = {id: uuidv4(), login, password: hashedPassword };
        users.push(newUser);

        fs.writeFileSync("data.json", JSON.stringify(users, null, 2));

        resolve("Пользователь зарегистрирован");
      } catch (error) {
        reject("Ошибка регистрации пользователя");
      }
    });
  }

  loginUser(info) {
    return new Promise(async (resolve, reject) => {
      try {
        const { login, password } = info;
        const user = users.find((user) => user.login === login);
        if (!user) {
          reject("Неверный email или пароль");
          return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          reject("Неверный email или пароль");
        }
        const token = jwt.sign({ userId: user._id },process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: "1h",
        });
        console.log(user);

        resolve({ token, userId: user._id });
        
      } catch (error) {
        console.log(error);
        reject("Ошибка входа в систему");
      }
    });
  }

  createTodo(info) {
    return new Promise(async (resolve, reject) => {
      try {
        const dataTodos = fs.readFileSync("todos.json", "utf8");
        const todos = JSON.parse(dataTodos);
        users.push(...todos);

        const { title, isCompleted,userId } = info;

      
        const newTask = {
          id: uuidv4(),
          title,
          isCompleted,
          userId,
        };

        todos.push(newTask);

        fs.writeFileSync("todos.json", JSON.stringify(todos, null, 2)); 

        resolve({ "Создан новый таск.": newTask });
      } catch (error) {
        console.error(error);
        reject("Ошибка создания таска'");
      }
    });
  }
}

module.exports = new UsersService();
