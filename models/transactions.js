const db = require("./conn.js");
const moment = require('moment');


class Transactions {
  static async getTransactionsByUser(username) {
    const startDate = moment().subtract(30, 'days').format('YYYY-MM-DD');
    try {
      const response = await db.any("select to_char(t.date, 'YYYY-MM-DD') as date, t.price, t.type as txn_type, t.subtype, s.unofficial_currency_code, s.ticker_symbol, s.type as security_type from investment_transactions t join securities s on t.security_id = s.security_id where t.username = ($1) and t.date > ($2) and t.type in ('buy', 'sell') order by t.date desc", [username, startDate]);
      return response;
    } catch (err) {
      return err.message;
    }
  }

  static async saveTransactions(username, transactions) {
    // add user_id to each holding object
    transactions.forEach(transaction => {
      transaction.username = username
    })
    db.tx(t => {
      const queries = transactions.map(transaction => {
        return t.none('insert into investment_transactions (investment_transaction_id, username, cancel_transaction_id, account_id, security_id, date, name, quantity, amount, price, fees, type, subtype, iso_currency_code, unofficial_currency_code) values (${investment_transaction_id}, ${username}, ${cancel_transaction_id}, ${account_id}, ${security_id}, ${date}, ${name}, ${quantity}, ${amount}, ${price}, ${fees}, ${type}, ${subtype}, ${iso_currency_code}, ${unofficial_currency_code})'
          , transaction);
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

  static async upsertTransactions(username, transactions) {
    transactions.forEach(transaction => {
      transaction.username = username
    })
    db.tx(t => {
      const queries = transactions.map(transaction => {
        return t.none('insert into investment_transactions (investment_transaction_id, username, cancel_transaction_id, account_id, security_id, date, name, quantity, amount, price, fees, type, subtype, iso_currency_code, unofficial_currency_code) values (${investment_transaction_id}, ${username}, ${cancel_transaction_id}, ${account_id}, ${security_id}, ${date}, ${name}, ${quantity}, ${amount}, ${price}, ${fees}, ${type}, ${subtype}, ${iso_currency_code}, ${unofficial_currency_code}) on conflict (investment_transaction_id) do nothing'
          , transaction);
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

  static async deleteTransactions(username) {
    try {
      const response = await db.none('delete from investment_transactions where username = ($1)', username)
      return response
    } catch (err) {
      return err.message;
    }
  }
}

module.exports = Transactions;