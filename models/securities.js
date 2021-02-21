const db = require("./conn.js");

const plaidSample = require('../plaidSample.json')

class Securities {
  static async saveSecurities(username, securities = plaidSample.holdings.securities) {
    // add username to each holding object
    securities.forEach(security => {
      security.username = username
    })
    db.tx(t => {
      const queries = securities.map(security => {
        return t.none('insert into securities (username, close_price, close_price_as_of, cusip, institution_id, institution_security_id, is_cash_equivalent, isin, iso_currency_code, name, proxy_security_id, security_id, sedol, ticker_symbol, type, unofficial_currency_code) values (${username}, ${close_price}, ${close_price_as_of}, ${cusip}, ${institution_id}, ${institution_security_id}, ${is_cash_equivalent}, ${isin}, ${iso_currency_code}, ${name}, ${proxy_security_id}, ${security_id}, ${sedol}, ${ticker_symbol}, ${type}, ${unofficial_currency_code})'
          , security);
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

  static async deleteSecurities(username) {
    try {
      const response = await db.none('delete from securities where username = ($1)', username)
      return response
    } catch (err) {
      return err.message;
    }
  }
}

module.exports = Securities;