const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();

const mongoHelper = {
  async getConnection() {
    return MongoClient.connect(process.env.MONGO_CONNECTION_STRING);
   
  },
  useDefaultDb(connection) {
    return connection.db(process.env.MONGO_DB_NAME);
  },
};

module.exports = mongoHelper;
