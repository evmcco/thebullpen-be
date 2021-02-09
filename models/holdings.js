const db = require("./conn.js");

class Holdings {
  static async getHoldingsByUser(userId) {
    try {
      const response = await db.any(`select * from holdings h join securities s on h.security_id = s.security_id where user_id = ${userId}`);
      return response;
    } catch (err) {
      return err.message;
    }
  }

  static async saveHoldings(holdings, user_id) {
    db.tx(t => {
      const queries = holdings.map(holding => {
        return t.none(`insert into holdings 
        (security_id, institution_price, institution_value, cost_basis, quantity, user_id) 
        values (${security_id}, ${institution_price}, ${institution_value}, ${cost_basis}, ${quantity}, ${user_id})`
          , holding);
      });
      console.log(`QUERIES, ${queries}`)
      return t.batch(queries);
    })
      .then(data => {
        return true
      })
      .catch(error => {
        return error.message
      });
  }
}

module.exports = Holdings;