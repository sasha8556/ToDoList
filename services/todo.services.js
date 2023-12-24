const { getConnection, useDefaultDb } = require("../helpers/mongoHelper");

class TodoService {
  #COLLECTION = "tasks";

  async createTodo(newTodo) {
    const connection = await getConnection();
    const db = useDefaultDb(connection);
    await db.collection(this.#COLLECTION).insertOne(newTodo);
    connection.close();
  }

  async getTasks(userId) {
    const connection = await getConnection();
    const db = useDefaultDb(connection);
    const [data] = await db
      .collection(this.#COLLECTION)
      .aggregate([{ $match: { userId } }])
      .toArray();
    connection.close();
    return data;
  }

  async updateTitle(id, title) {
    const connection = await getConnection();
    const db = useDefaultDb(connection);
    const updateResult = await db
      .collection(this.#COLLECTION)
      .updateOne({ id: id }, { $set: { title: title } });
    connection.close();
    return updateResult;
  }
  async updateIsCompleted(id) {
    const connection = await getConnection();
    const db = useDefaultDb(connection);
    const updateResult = await db
      .collection(this.#COLLECTION)
      .updateOne({ id: id }, { $set: { isCompleted: true } });
    connection.close();
    return updateResult;
  }

  async deleteTodoById(id) {
    const connection = await getConnection();
    const db = useDefaultDb(connection);
    const deleteResult = await db
      .collection(this.#COLLECTION)
      .deleteMany({ id: id });
    connection.close();
    return deleteResult;
  }
}

module.exports = new TodoService();
