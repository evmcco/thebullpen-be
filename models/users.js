const db = require("./conn.js");

class Users {
  static async getAllUsers() {
    try {
      const response = await db.any(`select * from users`);
      return response;
    } catch (err) {
      return err.message;
    }
  }

  // static async getUserSetupData(auth0UserId) {
  //   try {
  //     const response = await db.one('select * from users where auth0userid = ($1)', auth0UserId);
  //     return response;
  //   } catch (err) {
  //     return err.message;
  //   }
  // }

  static async saveAuth0UserId(userId) {
    try {
      const response = await db.one('insert into users (id) values ($1)', userId)
      return response;
    } catch (err) {
      return err.message
    }
  }
}

module.exports = Users;