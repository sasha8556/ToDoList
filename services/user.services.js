const fs = require("fs");

class UsersService {
  getUser() {
    return new Promise((res, rej) => {
      fs.readFile("data.json", "utf8", (error, data) => {
        if (error) {
          rej(error);
        } else {
          const result = JSON.parse(data);
          res(result);
        }
      });
    });
  }
  registerUser(newUser) {
    return new Promise((resolve, reject) => {
      fs.readFile("data.json", "utf8", (err, data) => {
        if (err) {
          console.error(err);
          reject(err);
        }

        const result = JSON.parse(data);
        result.push(newUser);

        fs.writeFile("data.json", JSON.stringify(result, null, 3), (err) => {
          if (err) {
            console.error(err);
            reject(err);
            return;
          }
          resolve("Файл успешно записан.");
        });
      });
    });
  }
}

module.exports = new UsersService();
