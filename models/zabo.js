const db = require("./conn.js");

class Zabo {
  //save new account
  static async saveAccount(username, userId, accountId, providerName, providerLogoUrl) {
    try {
      const response = await db.none('insert into zabo_accounts (username, user_id, account_id, provider_name, provider_logo) values ($1, $2, $3, $4, $5)', [username, userId, accountId, providerName, providerLogoUrl])
    } catch (err) {
      return err.message
    }
  }
  //get accounts for a user
  static async getZaboUserId(username) {
    try {
      const response = await db.one('select distinct user_id from zabo_accounts where username = ($1)', username)
      return response.user_id
    } catch (err) {
      return err.message
    }
  }
}

module.exports = Zabo;