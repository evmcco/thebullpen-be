const db = require("./conn.js");

const plaidSample = require('../plaidSample.json')

class Holdings {
  static async getHoldingsByUser(username) {
    try {
      const response = await db.any("select h.*, s.* from holdings h left join securities s on h.security_id = s.security_id where h.username = ($1) and s.type != 'cash' order by s.ticker_symbol", username);
      return response;
    } catch (err) {
      return err.message;
    }
  }

  static async saveHoldings(item_id, username, holdings) {
    // add user_id to each holding object
    holdings.forEach(holding => {
      holding.item_id = item_id
      holding.username = username
    })
    db.tx(t => {
      const queries = holdings.map(holding => {
        return t.none('insert into holdings (item_id, username, account_id, security_id, institution_price, institution_price_as_of, institution_value, cost_basis, quantity, iso_currency_code, unofficial_currency_code) values (${item_id}, ${username}, ${account_id}, ${security_id}, ${institution_price}, ${institution_price_as_of}, ${institution_value}, ${cost_basis}, ${quantity}, ${iso_currency_code}, ${unofficial_currency_code})'
          , holding);
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

  static async deleteHoldings(item_id) {
    try {
      const response = await db.none('delete from holdings where item_id = ($1)', item_id)
      return response
    } catch (err) {
      return err.message;
    }
  }
}

module.exports = Holdings;