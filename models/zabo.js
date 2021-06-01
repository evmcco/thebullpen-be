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
    //check if user has a zabo connection yet
    const doesUserHaveZaboId = await db.one("select exists(select 1 from zabo_accounts where username = ($1))", username)
    //if so, get the user_id
    if (doesUserHaveZaboId.exists) {
      try {
        const response = await db.one('select distinct user_id from zabo_accounts where username = ($1)', username)
        return response.user_id
      } catch (err) {
        return err.message
      }
      //if not, return false
    } else {
      return false
    }
  }

  static async getUsernameFromAccountId(accountId) {
    try {
      const response = await db.one("select username from zabo_accounts where account_id = $1", accountId)
      return response.username
    } catch (err) {
      return err.message
    }
  }

  static async deleteZaboAccount(accountId) {
    try {
      const response = await db.none("delete from zabo_accounts where account_id = $1", accountId)
      return response.username
    } catch (err) {
      return err.message
    }
  }
}

module.exports = Zabo;