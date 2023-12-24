// const fs = require("fs");
const { getConnection, useDefaultDb } = require('../helpers/mongoHelper')

class UsersService {
  #COLLECTION = "users";

  async getUser() {
    const connection = await getConnection();
    const db = useDefaultDb(connection);
    const data = await db
    .collection(this.#COLLECTION)
    .aggregate()
    .toArray();
    connection.close();
    return data;
  }

  async registerUser(newUser) {
    const connection = await getConnection()
    const db = useDefaultDb(connection)
    await db.collection(this.#COLLECTION).insertOne(newUser)
    connection.close()
  }
}

module.exports = new UsersService();
