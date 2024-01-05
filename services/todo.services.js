const Todo = require("../models/todo.model");

class TodoService {
  async createTodo(newTodo) {
    return await Todo.create(newTodo);
  }
  async getTodoById(id) {
    return await Todo.findById(id);
  }

  async getTasks() {
    return await Todo.find();
  }

  async updateTitle(id, title) {
    await Todo.updateOne({ _id: id }, { title: title });
    return this.getTodoById(id);
  }
  async updateIsCompleted(id) {
    const todo = await this.getTodoById(id);
    await Todo.updateOne({ _id: id }, { isCompleted: !todo.isCompleted });
    return await this.getTodoById(id);
  }

  async deleteTodoById(id) {
    return await Todo.deleteOne({ _id: id })
  }
}

module.exports = new TodoService();
