const db = require("./conn.js");
const moment = require('moment');

class Performance {
  static async saveTickerPerformance(data) {
    const date = moment().format('YYYY-MM-DD')
    try {
      // const response = await db.none('insert into performance (username, ticker, weight, change, date) values (($1), ($2), ($3), ($4), ($5))', [...data, date])
      // return response

      //upsert performance row
      console.log(data, date)
    } catch (err) {
      return err.message
    }
  }
}

module.exports = Performance;
