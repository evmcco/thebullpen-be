const db = require("./conn.js");

class Users {
  static async saveAccessToken(body) {
    console.log(body)
    try {
      const response = await db.one('insert into plaid_access_tokens (username, access_token, item_id) values ($1, $2, $3)', [body.username, body.plaid_access_token, body.item_id])
    } catch (err) {
      return err.message
    }
  }

  static async getAccessTokens(username) {
    try {
      const response = await db.any('select access_token, item_id from plaid_access_tokens where username = ($1)', username)
      return response
    } catch (err) {
      return err.message
    }
  }

  static async getAllUsersAccessTokens() {
    try {
      const response = await db.any('select * from plaid_access_tokens')
      return response
    } catch (err) {
      return err.message
    }
  }

  static async getUserByItemId(itemId) {
    try {
      const response = await db.one('select * from plaid_access_tokens where item_id = ($1)', itemId)
      return response
    } catch (err) {
      return err.message
    }
  }

  static async doesUserHaveAccessToken(username) {
    try {
      const response = await db.one('select exists(select 1 from plaid_access_tokens where username = ($1))', username)
      return response
    } catch (err) {
      return err.message
    }
  }
}

module.exports = Users;