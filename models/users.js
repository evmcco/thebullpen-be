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

  static async saveAccessToken(body) {
    console.log(body)
    try {
      const response = await db.one('insert into plaid_access_tokens (username, access_token) values ($1, $2)', [body.username, body.plaid_access_token])
    } catch (err) {
      return err.message
    }
  }

  static async getAccessTokens(username) {
    try {
      const response = await db.any('select access_token from plaid_access_tokens where username = ($1)', username)
      return response
    } catch (err) {
      return err.message
    }
  }

}

module.exports = Users;