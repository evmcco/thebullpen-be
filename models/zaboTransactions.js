const db = require("./conn.js");

class ZaboTransactions {
  //save new transactions
  static async saveTransactions(username, accountId, transactions) {
    db.tx(t => {
      const queries = transactions.map(transaction => {
        return t.none("insert into zabo_transactions (id, username, account_id, transaction_json) values ($1, $2, $3, $4)"
          , [transaction.id, username, accountId, transaction]);
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
  //get transactions for a user
  static async getTransactions(username) {
    try {
      const response = db.any("select * from zabo_transactions where username = $1", username)
      return response
    } catch (err) {
      return err.message
    }
  }
}

module.exports = ZaboTransactions;