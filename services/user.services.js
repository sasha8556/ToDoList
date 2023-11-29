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

        const newUser = { id: uuidv4(), login, password: hashedPassword };
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
          reject("Неверный login или пароль");
          return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          reject("Неверный login или пароль");
        }
        console.log(process.env.ACCESS_TOKEN_SECRET);
        const token = jwt.sign(
          { userId: user.id },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "1h",
          }
        );
        console.log(user);

        resolve({ token });
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

        const { title, isCompleted, userId } = info;

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

  getTasks(userId) {
    return new Promise((resolve, reject) => {
      try {
        const data = fs.readFileSync("todos.json", "utf8");
        const allTodos = JSON.parse(data);
        const userTodos = allTodos.filter((todo) => todo.userId === userId);
        resolve(userTodos);
      } catch (error) {
        console.error(error);
        reject("Ошибка при получении задач");
      }
    });
  }

  updateTitle(id, title, taskId) {
    return new Promise((resolve, reject) => {
      try {
        const data = fs.readFileSync("todos.json", "utf8");
        const allTodos = JSON.parse(data);
        console.log(allTodos);
        const foundTodo = allTodos.find(
          (todo) => todo.id === taskId && todo.userId === id
        );
        console.log(foundTodo);
        if (!foundTodo) {
          reject("Такого id не существует");
          return;
        }
        foundTodo.title = title;

        fs.writeFileSync("todos.json", JSON.stringify(allTodos, null, 2));
        resolve(allTodos);
      } catch (error) {
        console.error(error);
        reject("Ошибка обновления свойства title");
      }
    });
  }
  updateIsCompleted(id,isCompleted, taskId) {
    return new Promise((resolve, reject) => {
      try {
        const data = fs.readFileSync("todos.json", "utf8");
        const allTodos = JSON.parse(data);
        console.log(allTodos);
        const foundTodo = allTodos.find(
          (todo) => todo.id === taskId && todo.userId === id
        );
        console.log(foundTodo);
        if (!foundTodo) {
          reject("Такого id не существует");
          return;
        }
        foundTodo.isCompleted = isCompleted;

        fs.writeFileSync("todos.json", JSON.stringify(allTodos, null, 2));
        resolve(allTodos);
      } catch (error) {
        console.error(error);
        reject("Ошибка обновления свойства isCompleted");
      }
    });
  }

  deleteTodoById(id, taskId) {
    return new Promise((resolve, reject) => {
      try {
        const data = fs.readFileSync("todos.json", "utf8");
        const allTodos = JSON.parse(data);
        console.log(allTodos);
        const taskIndex = allTodos.findIndex(
          (todo) => todo.id === taskId && todo.userId === id
        );
        console.log("Index:", taskIndex);
        if (taskIndex === -1) {
          reject("Такого id не существует");
          return;
        }
        allTodos.splice(taskIndex, 1);

        fs.writeFileSync("todos.json", JSON.stringify(allTodos, null, 2));
        resolve(allTodos);
      } catch (error) {
        console.error(error);
        reject("Ошибка удаления таска");
      }
    });
  }
}

module.exports = new UsersService();

