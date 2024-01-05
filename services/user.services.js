const User = require("../models/user.model");

class UsersService {
  async getUser() {
    return await User.find();
  }

  async registerUser(newUser) {
    return await User.create(newUser);
  }
}

module.exports = new UsersService();
