const db = require("./conn.js");

class Zabo {
  static async saveAccountId(body) {
    try {
      const response = await db.none('insert into zabo_account_ids (username, account_id) values ($1, $2)', [body.username, body.zabo_account_id])
    } catch (err) {
      return err.message
    }
  }
}

module.exports = Zabo;