// const fs = require("fs");
// const { getConnection, useDefaultDb } = require('../helpers/mongoHelper')
const User=require('../models/user.model')

class UsersService {
  // #COLLECTION = "users";

  async getUser() {
    return await User.find();
    // const connection = await getConnection();
    // const db = useDefaultDb(connection);
    // const data = await db
    // .collection(this.#COLLECTION)
    // .aggregate()
    // .toArray();
    // connection.close();
    // return data;
  }

  async registerUser(newUser) {
    return await User.create(newUser);
    // const connection = await getConnection()
    // const db = useDefaultDb(connection)
    // await db.collection(this.#COLLECTION).insertOne(newUser)
    // connection.close()
  }
}

module.exports = new UsersService();
