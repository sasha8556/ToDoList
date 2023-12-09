const fs = require("fs");

class TodoService {
  createTodo(newTodo) {
    return new Promise(async (resolve, reject) => {
      fs.readFile("todos.json", "utf8", (error, data) => {
        if (error) {
          reject(error);
        } else {
          const result = JSON.parse(data);
          result.push(newTodo);
          fs.writeFile("todos.json", JSON.stringify(result, null, 3), (err) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          });
        }
      });
    });
  }

  getTasks(userId) {
    return new Promise((resolve, reject) => {
      try {
        fs.readFile("todos.json", "utf8", (err, data) => {
          if (err) {
            console.error(err);
            reject(err);
          }
          const allTodos = JSON.parse(data);
          const userTodos = allTodos.filter((todo) => todo.userId === userId);
          resolve(userTodos);
        });
      } catch (error) {
        console.error(error);
        reject("Ошибка при получении задач");
      }
    });
  }

  updateTitle(id, title) {
    return new Promise((resolve, reject) => {
      fs.readFile("todos.json", "utf8", (error, data) => {
        if (error) {
          reject(error);
        } else {
          const obj = JSON.parse(data);
          const index = obj.findIndex((item) => item.id === id);
          if (index === -1) {
            reject("Индекс не найден");
          } else {
            const updatedPets = { ...obj[index], title };
            obj[index] = updatedPets;
            console.log(updatedPets);

            fs.writeFile(
              "todos.json",
              JSON.stringify(obj, null, 3),
              "utf8",
              (error) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(updatedPets);
                }
              }
            );
          }
        }
      });
    });
  }
  updateIsCompleted(id) {
    return new Promise((resolve, reject) => {
      fs.readFile("todos.json", "utf8", (error, data) => {
        if (error) {
          reject(error);
        } else {
          const allTodos = JSON.parse(data);
          const foundIndex = allTodos.findIndex((todo) => todo.id === id);
          if (foundIndex === -1) {
            reject("Такого id не существует");
          } else {
            const updateTodo = { ...allTodos[foundIndex] };
            updateTodo.isCompleted = !updateTodo.isCompleted;
            allTodos[foundIndex] = updateTodo;
            fs.writeFile(
              "todos.json",
              JSON.stringify(allTodos, null, 3),
              "utf8",
              (err) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(updateTodo);
                }
              }
            );
          }
        }
      });
    });
  }

  deleteTodoById(id) {
    return new Promise((resolve, reject) => {
      fs.readFile("todos.json", "utf8", (error, data) => {
        if (error) {
          reject(error);
        } else {
          const allTodos = JSON.parse(data);
          const taskIndex = allTodos.findIndex((todo) => todo.id === id);
          if (taskIndex === -1) {
            reject("Такого id не существует");
            return;
          }
          allTodos.splice(taskIndex, 1);
          fs.writeFile(
            "todos.json",
            JSON.stringify(allTodos, null, 2),
            "utf8",
            (err) => {
              if (err) {
                reject(err);
              } else {
                resolve("Таска удалена");
              }
            }
          );
        }
      });
    });
  }
}

module.exports = new TodoService();
