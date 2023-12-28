// const mongoose = require('mongoose');
// // require("dotenv").config();
// const User = require('../models/user.model')

// const MONGO_URL = "mongodb://localhost:27017/ToDo";
// console.log("MONGO_URL:",MONGO_URL);

// async function connectDb() {
//     try {
//         await mongoose.connect(MONGO_URL);
//         console.log('Successful connection to MongoDb');
//     } catch(err) {
//         console.log(err);
//     }
// }

// module.exports = {
//     connectDb
// };

const mongoose = require("mongoose");

const url = "mongodb://localhost:27017/ToDo";
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log("Connected to the database");
});

module.exports = db;
