const db = require("./conn.js");

const plaidSample = require('../plaidSample.json')

class Holdings {
  static async getHoldingsByUser(userId) {
    try {
      const response = await db.any(`select * from holdings h join securities s on h.security_id = s.security_id where user_id = ${userId}`);
      return response;
    } catch (err) {
      return err.message;
    }
  }

  static async saveHoldings(user_id, holdings = plaidSample.holdings.holdings) {
    // add user_id to each holding object
    holdings.forEach(holding => {
      holding.user_id = user_id
    })
    console.log('user_id', user_id)
    db.tx(t => {
      const queries = holdings.map(holding => {
        return t.none('insert into holdings (security_id, institution_price, institution_value, cost_basis, quantity, user_id) values (${security_id}, ${institution_price}, ${institution_value}, ${cost_basis}, ${quantity}, ${user_id})'
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