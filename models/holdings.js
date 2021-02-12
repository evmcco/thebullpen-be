const db = require("./conn.js");

const plaidSample = require('../plaidSample.json')

class Holdings {
  static async getHoldingsByUser(username) {
    try {
      const response = await db.any(`select h.*, s.* from holdings h join securities s on h.security_id = s.security_id and h.username = s.username where h.username = '${username}'`);
      return response;
    } catch (err) {
      return err.message;
    }
  }

  static async saveHoldings(username, holdings = plaidSample.holdings.holdings) {
    // add user_id to each holding object
    holdings.forEach(holding => {
      holding.username = username
    })
    db.tx(t => {
      const queries = holdings.map(holding => {
        return t.none('insert into holdings (username, account_id, security_id, institution_price, institution_price_as_of, institution_value, cost_basis, quantity, iso_currency_code, unofficial_currency_code) values (${username}, ${account_id}, ${security_id}, ${institution_price}, ${institution_price_as_of}, ${institution_value}, ${cost_basis}, ${quantity}, ${iso_currency_code}, ${unofficial_currency_code})'
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
}

module.exports = Holdings;