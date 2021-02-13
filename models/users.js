const db = require("./conn.js");

class Users {
  static async saveUsername(username) {
    try {
      const response = await db.one('insert into usernames values (lower($1)) returning username', username)
      return response
    } catch (err) {
      return err.message
    }
  }

  static async doesUsernameExist(username) {
    try {
      const response = await db.one('select exists (select * from usernames where lower(username) = lower($1))', username)
      return response.exists
    } catch (err) {
      return err.message
    }
  }


}

module.exports = Users;