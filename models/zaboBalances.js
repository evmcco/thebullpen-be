const db = require("./conn.js");

class ZaboBalances {
  //delete balances for a user-account
  static async deleteBalancesForAccount(accountId) {
    try {
      const response = db.none("delete from zabo_balances where account_id = $1", accountId)
    } catch (err) {
      return err.message
    }
  }
  //save balances for a user-account
  static async saveBalances(username, accountId, balances) {
    db.tx(t => {
      const queries = balances.map(balance => {
        return t.none("insert into zabo_balances (username, account_id, balance_json) values ($1, $2, $3)"
          , [username, accountId, balance]);
      });
      return t.batch(queries);
    })
      .then(data => {
        return data
      })
      .catch(error => {
        return error.message
      });
  }
  //get balances for a user
  static async getBalances(username) {
    try {
      const response = db.any("select * from zabo_balances where username = ($1)", username)
      return response
    } catch (err) {
      return err.message
    }
  }
}

module.exports = ZaboBalances;